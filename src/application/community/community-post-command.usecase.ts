import { inject, injectable } from "tsyringe";
import {
  ICommunityPostCommandUsecase,
} from "../../domain/interfaces/usecase/community-usecase.interface";
import {
  ICommentRepository,
  ICommunityPostRepository,
  ICommunityRepository,
  ILikeRepository,
} from "../../domain/interfaces/repository/community.repository";
import {
  AddCommentInput,
  CreatePostInput,
  EditCommentInput,
  EditPostInput,
  LikePostInput,
} from "../../domain/interfaces/usecase/types/community.types";
import { ICommunityPost, UserType } from "../../domain/models/community";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";
import { IClientRepository } from "../../domain/interfaces/repository/client.repository";
import { IAwsS3Service } from "../../domain/interfaces/service/aws-service.interface";
import { IGetPresignedUrlUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { generateS3FileKey } from "../../shared/utils/helper/s3FileKeyGenerator";
import { config } from "../../shared/config/config";
import { cleanUpLocalFiles } from "../../shared/utils/helper/clean-local-file.helper";
import logger from "../../shared/logger/logger";
import { IVendorRepository } from "../../domain/interfaces/repository/vendor.repository";
import { Types } from "mongoose";

@injectable()
export class CommunityPostCommandUsecase
  implements ICommunityPostCommandUsecase
{
  constructor(
    @inject("ICommunityRepository")
    private _communityRepo: ICommunityRepository,
    @inject("ICommunityPostRepository")
    private _communityPostRepo: ICommunityPostRepository,
    @inject("ICommentRepository") private _commentRepo: ICommentRepository,
    @inject("IClientRepository") private _clientRepo: IClientRepository,
    @inject("IAwsS3Service") private _awsS3Service: IAwsS3Service,
    @inject("IGetPresignedUrlUsecase")
    private presignedUrl: IGetPresignedUrlUsecase,
    @inject("ILikeRepository") private _likeRepo: ILikeRepository,
    @inject("IVendorRepository") private _vendorRepo: IVendorRepository
  ) {}

  async createPost(input: CreatePostInput): Promise<ICommunityPost> {
    const {
      communityId,
      content,
      tags,
      title,
      userId,
      media,
      mediaType,
      role,
    } = input;
    // const userType =

    const commnity = await this._communityRepo.findById(communityId);
    if (!commnity) {
      throw new CustomError(
        ERROR_MESSAGES.COMMUNITY_NO_EXIST,
        HTTP_STATUS.NOT_FOUND
      );
    }

    let user;
    if (role === "Client") {
      user = await this._clientRepo.findById(userId);
    } else {
      user = await this._vendorRepo.findById(userId);
    }
    if (!user) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    let fileKeys: string[] = [];
    const uploadedKeys: string[] = [];

    if (media && media.length > 0) {
      try {
        fileKeys = media.map((media) => {
          return generateS3FileKey(config.s3.communityPost, media.originalname);
        });

        const uploadedPromises = media.map(async (media, indx) => {
          const filekey = fileKeys[indx];
          try {
            await this._awsS3Service.uploadFileToAws(filekey, media.path);
          } catch (error) {
            console.error(`Failed to upload ${media.originalname}:`, error);
            throw error;
          }
        });
        await Promise.all(uploadedPromises);
      } catch (error) {
        if (uploadedKeys.length > 0) {
          logger.info(
            `Cleaning up ${uploadedKeys.length} uploaded files from S3`
          );
          await Promise.allSettled(
            uploadedKeys.map((key) => {
              return this._awsS3Service
                .deleteFileFromAws(key)
                .catch((err) => console.log(err));
            })
          );
        }

        throw error;
      } finally {
        cleanUpLocalFiles(media);
      }
    }

    const [newPost] = await Promise.all([
      this._communityPostRepo.create({
        communityId: communityId,
        media: fileKeys || [],
        mediaType: mediaType,
        title: title,
        content: content,
        tags: tags || [],
        userId: userId,
        userType: role as UserType,
      }),
      this._communityRepo.update(communityId, {
        $inc: { postCount: 1 },
      }),
    ]);

    if (!newPost || !newPost._id) {
      throw new CustomError(
        ERROR_MESSAGES.POST_CREATION_FAILED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    const post: any = await this._communityPostRepo.findById(newPost._id, [
      "userId",
    ]);

    if (!post) {
      throw new CustomError(
        "failed to create new post please try again later",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (post.media && post.media.length > 0) {
      post.media = await Promise.all(
        post.media.map(async (media: any) => {
          return await this.presignedUrl.getPresignedUrl(media);
        })
      );
    }

    if (post.userId.profileImage) {
      post.userId.profileImage = await this.presignedUrl.getPresignedUrl(
        post.userId.profileImage
      );
    }

    return post;
  }

  async likePost(input: LikePostInput): Promise<{ success: boolean }> {
    const { postId, userId, role } = input;

    try {
      const post = await this._communityPostRepo.findById(postId);
      if (!post) {
        throw new CustomError(
          ERROR_MESSAGES.POST_NOT_EXISTS,
          HTTP_STATUS.NOT_FOUND
        );
      }

      const userType = role === "client" ? "Client" : "Vendor";

      // Check if user already liked this post
      const existingLike = await this._likeRepo.findOne({
        userId: userId,
        postId: postId,
      });

      if (existingLike) {
        logger.warn(`User ${userId} already liked post ${postId}`);
        return { success: false };
      }

      // Create like document
      const like = await this._likeRepo.create({
        postId: postId,
        userId: userId,
        userType: userType as UserType,
      });

      if (!like) {
        logger.error("Failed to create like document");
        return { success: false };
      }

      // Update post like count
      await this._communityPostRepo.update(postId, {
        $inc: { likeCount: 1 },
      });

      logger.info(`User ${userId} successfully liked post ${postId}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error liking post: ${error}`);
      return { success: false };
    }
  }

  async unLikePost(input: LikePostInput): Promise<{ success: boolean }> {
    const { postId , userId } = input;

    try {
      console.log("In unlike post usecase");

      const [post, like] = await Promise.all([
        this._communityPostRepo.findById(postId),
        this._likeRepo.findOne({ userId: userId, postId: postId }),
      ]);

      if (!post) {
        logger.error("Post not found");
        return { success: false };
      }

      if (!like || !like._id) {
        logger.error("Like not found for user and post");
        return { success: false };
      }

      console.log("Got the post and like", post, like);

      // Delete the like document
      const isDeleted = await this._likeRepo.delete(like._id);

      // Fix: The logic was inverted - if deletion succeeded, return success: true
      if (!isDeleted) {
        logger.error("Failed to delete like document");
        return { success: false };
      }

      // Update post like count
      await this._communityPostRepo.update(postId, {
        $inc: { likeCount: -1 },
      });

      logger.info(`User ${userId} successfully unliked post ${postId}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error unliking post: ${error}`);
      return { success: false };
    }
  }

  async addComment(input: AddCommentInput): Promise<void> {
    const { content, postId, userId, role } = input;

    const post = await this._communityPostRepo.findById(postId);
    if (!post) {
      throw new CustomError(
        ERROR_MESSAGES.POST_NOT_EXISTS,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const userType = role === "client" ? "Client" : "Vendor";
    await Promise.all([
      this._communityPostRepo.update(postId, {
        $inc: { commentCount: 1 },
      }),
      this._commentRepo.create({
        content: content,
        userType: userType as UserType,
        postId: postId,
        userId: userId,
      }),
    ]);
  }

  async editPost(input: EditPostInput): Promise<void> {
    const {
      _id,
      title,
      content,
      deletedImageKeys,
      existingImageKeys,
      newImages,
      tags,
    } = input;

    console.log("editPost input:", input);

    const uploadedKeys: string[] = [];
    const fileKeys: string[] = existingImageKeys || [];

    try {
      // 1. Delete old images from S3 if needed
      if (deletedImageKeys && deletedImageKeys.length > 0) {
        const deletePromises = deletedImageKeys.map(async (key) => {
          const isAvailable =
            await this._awsS3Service.isFileAvailableInAwsBucket(key);
          if (isAvailable) {
            return await this._awsS3Service.deleteFileFromAws(key);
          }
        });
        await Promise.all(deletePromises);
      }

      // 2. Upload new images to S3 if any
      if (newImages && newImages.length > 0) {
        const uploadPromises = newImages.map(async (image) => {
          const fileKey = generateS3FileKey(
            config.s3.communityPost,
            image.path
          );
          await this._awsS3Service.uploadFileToAws(fileKey, image.path);
          uploadedKeys.push(fileKey);
          fileKeys.push(fileKey);
        });

        await Promise.all(uploadPromises);
      }

      // 3. Update the post in your DB
      await this._communityPostRepo.update(_id, {
        title,
        content,
        tags,
        media: fileKeys,
      });
    } catch (error) {
      // 4. Rollback: clean up uploaded images if something failed
      if (uploadedKeys.length > 0) {
        await Promise.allSettled(
          uploadedKeys.map((key) => {
            return this._awsS3Service
              .deleteFileFromAws(key)
              .catch((err) =>
                console.error("Failed to clean up S3 file:", err)
              );
          })
        );
      }
      throw error; // rethrow after cleanup
    } finally {
      // 5. Clean up local files regardless of success or failure
      if (newImages && newImages.length > 0) {
        await cleanUpLocalFiles(newImages);
      }
    }
  }

  async editComment(input: EditCommentInput): Promise<void> {
    const { commentId, content } = input;
    const isCommentExists = await this._commentRepo.findById(commentId);

    if (!isCommentExists) {
      throw new CustomError(
        ERROR_MESSAGES.COMMENT_NOT_EXISTS,
        HTTP_STATUS.NOT_FOUND
      );
    }

    await this._commentRepo.update(commentId, {
      content: content,
    });
  }

  async deleteComment(commentId: Types.ObjectId): Promise<void> {
    const isCommentExists = await this._commentRepo.findById(commentId);

    if (!isCommentExists) {
      throw new CustomError(
        ERROR_MESSAGES.COMMENT_NOT_EXISTS,
        HTTP_STATUS.NOT_FOUND
      );
    }

    await Promise.all([
      this._communityPostRepo.update(isCommentExists.postId, {
        $inc: { commentCount: -1 },
      }),
      this._commentRepo.delete(commentId),
    ]);
  }

  async deletePost(postId: Types.ObjectId): Promise<void> {
    const isPostExists = await this._communityPostRepo.findById(postId);
    if (!isPostExists) {
      throw new CustomError(
        ERROR_MESSAGES.POST_NOT_EXISTS,
        HTTP_STATUS.NOT_FOUND
      );
    }

    await this._communityPostRepo.deleteCommunityPost(postId);
  }
}
