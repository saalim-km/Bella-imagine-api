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
import { FilterQuery } from "mongoose";
import { IComment, ICommunityPost } from "../../domain/models/community";
import {
  GetCommentUsecaseInput,
  GetPostDetailsInput,
  GetPostForUserOutput,
  GetPostUsecaseInput,
} from "../../domain/types/community.types";

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
    const { limit, page, communityId, userId } = input;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<ICommunityPost> = {};

    if (communityId && communityId !== undefined) {
      filter.communityId = communityId;
    }

    const allPost = await this._communityPostRepo.fetchAllPost(
      filter,
      userId,
      skip,
      limit,
      -1
    );

    let data = allPost.data;
    const total = allPost.total;

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

  async getPostDetails(input: GetPostDetailsInput): Promise<any> {
    const post = await this._communityPostRepo.fetchPostDetails(input);

    // Replace user profile image with presigned URL if exists
    if (post?.avatar) {
      post.avatar = await this._presignedUrl.getPresignedUrl(post.avatar);
    }

    // Replace each media item with presigned URL if file exists
    if (post?.media && Array.isArray(post.media)) {
      post.media = await Promise.all(
        post.media.map(async (media: string) => {
          const isFileExists = await this._s3Service.isFileAvailableInAwsBucket(
            media
          );
          if (isFileExists) {
            return await this._presignedUrl.getPresignedUrl(media);
          }
          return media;
        })
      );
    }

    if (post.comments && post.comments.length > 0) {
      post.comments = await Promise.all(
        post.comments.map(async (comment) => {
          if (comment.avatar) {
            const isImageExists =
              await this._s3Service.isFileAvailableInAwsBucket(comment.avatar);
            if (isImageExists) {
              comment.avatar = await this._presignedUrl.getPresignedUrl(
                comment.avatar
              );
            }
          }

          return comment;
        })
      );
    }

    return post;
  }

  async getAllCommentsForUser(
    input: GetCommentUsecaseInput
  ): Promise<PaginatedResponse<IComment>> {
    const { limit, page, userId } = input;

    const skip = (page - 1) * limit;
    return await this._commentRepo.fetchCommentsByUserId({
      limit: limit,
      skip: skip,
      userId: userId,
    });
  }

  async getAllPostForUser(
    input: GetPostUsecaseInput
  ): Promise<PaginatedResponse<GetPostForUserOutput>> {
    const { limit, page, userId } = input;
    const skip = (page - 1) * limit;
    const filter: FilterQuery<ICommunityPost> = {
      userId: userId,
    };

    const allPost = await this._communityPostRepo.fetchAllPostForUser({
      filter: filter,
      limit: limit,
      skip: skip,
      sort: -1,
    });

    let data = allPost.data;
    const total = allPost.total;

    data = await Promise.all(
      data.map(async (post) => {
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

        if (post.iconImage && post.iconImage !== undefined) {
          const isFileExists = await this._s3Service.isFileAvailableInAwsBucket(
            post.iconImage
          );
          if (isFileExists) {
            post.iconImage = await this._presignedUrl.getPresignedUrl(
              post.iconImage
            );
          }
        }

        if (post.coverImage && post.coverImage !== undefined) {
          const isFileExists = await this._s3Service.isFileAvailableInAwsBucket(
            post.coverImage
          );
          if (isFileExists) {
            post.coverImage = await this._presignedUrl.getPresignedUrl(
              post.coverImage
            );
          }
        }

        return post;
      })
    );

    console.log("data in usecase : ", data);
    return {
      data: data,
      total: total,
    };
  }
}
