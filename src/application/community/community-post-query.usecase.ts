import { inject, injectable } from "tsyringe";
import { ICommunityPostQueryUsecase } from "../../domain/interfaces/usecase/community-usecase.interface";
import {
  ICommentRepository,
  ICommunityPostRepository,
} from "../../domain/interfaces/repository/community.repository";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";
import { GetAllPostInput } from "../../domain/interfaces/usecase/types/community.types";
import { IGetPresignedUrlUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { IAwsS3Service } from "../../domain/interfaces/service/aws-service.interface";
import { FilterQuery, Types } from "mongoose";
import { ICommunityPost } from "../../domain/models/community";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";
import { GetPostDetailsInput } from "../../domain/types/community.types";

@injectable()
export class CommunityPostQueryUsecase implements ICommunityPostQueryUsecase {
  constructor(
    @inject("ICommunityPostRepository")
    private _communityPostRepo: ICommunityPostRepository,
    @inject("IGetPresignedUrlUsecase")
    private _presignedUrl: IGetPresignedUrlUsecase,
    @inject("IAwsS3Service") private _s3Service: IAwsS3Service,
    @inject("ICommentRepository") private _commentRepo: ICommentRepository
  ) {}

  async getAllPost(input: GetAllPostInput): Promise<PaginatedResponse<any>> {
    const { limit, page, communityId,userId} = input;
    const skip = (page - 1) * limit;

    let filter: FilterQuery<ICommunityPost> = {};

    if (communityId && communityId !== undefined) {
      filter.communityId = communityId;
    }

    let { data, total } = await this._communityPostRepo.fetchAllPost(
      filter,
      userId,
      skip,
      limit,
      -1,
    );

    data = await Promise.all(
      data.map(async (post) => {
        if (
          post.userId.profileImage &&
          post.userId.profileImage !== undefined
        ) {
          post.userId.profileImage = await this._presignedUrl.getPresignedUrl(
            post.userId.profileImage
          );
        }

        if (post.media && post.media.length > 0) {
          post.media = await Promise.all(
            post.media.map(async (media) => {
              const isFileExists =
                await this._s3Service.isFileAvailableInAwsBucket(media);
              if (isFileExists) {
                return await this._presignedUrl.getPresignedUrl(media);
              }

              return media;
            })
          );
        }
        return post;
      })
    );

    return {
      data: data,
      total: total,
    };
  }

  async getPostDetails(input : GetPostDetailsInput): Promise<any> {
    const post = await this._communityPostRepo.fetchPostDetails(input);

    // Replace user profile image with presigned URL if exists
    if (post?.userId?.profileImage) {
      post.userId.profileImage = await this._presignedUrl.getPresignedUrl(post.userId.profileImage);
    }

    // Replace each media item with presigned URL if file exists
    if (post?.media && Array.isArray(post.media)) {
      post.media = await Promise.all(
      post.media.map(async (media: string) => {
        const isFileExists = await this._s3Service.isFileAvailableInAwsBucket(media);
        if (isFileExists) {
        return await this._presignedUrl.getPresignedUrl(media);
        }
        return media;
      })
      );
    }

    return post;
  }
}
