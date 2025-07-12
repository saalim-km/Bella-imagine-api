import { inject, injectable } from "tsyringe";
import { ICommunityController } from "../../domain/interfaces/controller/community-controller.interface";
import {
  ICommunityCommandUsecase,
  ICommunityPostCommandUsecase,
  ICommunityPostQueryUsecase,
  ICommunityQueryUsecase,
} from "../../domain/interfaces/usecase/community-usecase.interface";
import { Request, Response } from "express";
import {
  addCommentSchema,
  createCommunitySchema,
  editCommentSchema,
  editPostSchema,
  fetchCommBySlugSchema,
  fetchCommunitySchema,
  getAllPostSchema,
  getCommentsSchema,
  getPostDetailsSchema,
  getPostsSchema,
  updateCommuitySchema,
} from "../../shared/utils/zod-validations/presentation/community.schema";
import { ResponseHandler } from "../../shared/utils/helper/response-handler";
import { SUCCESS_MESSAGES, TRole } from "../../shared/constants/constants";
import { CustomRequest } from "../middlewares/auth.middleware";
import { FetchAllCommunitiesSchema } from "../../shared/utils/zod-validations/presentation/client.schema";
import { objectIdSchema } from "../../shared/utils/zod-validations/validators/validations";
import { getCommunityMemberSchema } from "../../shared/utils/zod-validations/presentation/admin.schema";
import { createPostSchema } from "../../shared/utils/zod-validations/presentation/community.schema";

@injectable()
export class CommunityController implements ICommunityController {
  constructor(
    @inject("ICommunityCommandUsecase")
    private _communityCommand: ICommunityCommandUsecase,
    @inject("ICommunityQueryUsecase")
    private _communityQuery: ICommunityQueryUsecase,
    @inject('ICommunityPostCommandUsecase') private _communityPostUsecase : ICommunityPostCommandUsecase,
    @inject('ICommunityPostQueryUsecase') private _communityPostQueryUsecase : ICommunityPostQueryUsecase
  ) {}

  async createCommunity(req: Request, res: Response): Promise<void> {
    const files = req.files as
      | { [key: string]: Express.Multer.File[] }
      | undefined;

    const parsed = createCommunitySchema.parse({
      ...req.body,
      coverImage:
        files?.coverImage && files.coverImage.length > 0
          ? files.coverImage[0]
          : undefined,
      iconImage:
        files?.iconImage && files.iconImage.length > 0
          ? files.iconImage[0]
          : undefined,
    });

    await this._communityCommand.createNewCommunity(parsed);
    ResponseHandler.success(res, SUCCESS_MESSAGES.CREATED, 201);
  }

  async fetchAllCommunity(req: Request, res: Response): Promise<void> {
    const parsed = fetchCommunitySchema.parse(req.query);
    const communities = await this._communityQuery.fetchCommunity(parsed);
    ResponseHandler.success(res, SUCCESS_MESSAGES.DATA_RETRIEVED, communities);
  }

  async fetchCommunityDetais(req: Request, res: Response): Promise<void> {
    const { _id } = (req as CustomRequest).user;
    const parsed = fetchCommBySlugSchema.parse({
      slug: req.params.slug,
      userId: _id,
    });
    const community = await this._communityQuery.fetchCommunityDetailsBySlug(
      parsed
    );
    ResponseHandler.success(res, SUCCESS_MESSAGES.DATA_RETRIEVED, community);
  }

  async updateCommunity(req: Request, res: Response): Promise<void> {
    const files = req.files as
      | { [key: string]: Express.Multer.File[] }
      | undefined;

    const parsed = updateCommuitySchema.parse({
      ...req.body,
      coverImage:
        files?.coverImage && files.coverImage.length > 0
          ? files.coverImage[0]
          : undefined,
      iconImage:
        files?.iconImage && files.iconImage.length > 0
          ? files.iconImage[0]
          : undefined,
    });
    await this._communityCommand.updateCommunity(parsed);
    ResponseHandler.success(res, SUCCESS_MESSAGES.UPDATE_SUCCESS);
  }

  async fetchAllCommunitiesForUser(req: Request, res: Response): Promise<void> {
    const userId = objectIdSchema.parse((req as CustomRequest).user._id);
    const parsed = FetchAllCommunitiesSchema.parse(req.query);
    const communities = await this._communityQuery.fetchAllCommunitiesForUsers({
      ...parsed,
      userId: userId,
    });
    ResponseHandler.success(res, SUCCESS_MESSAGES.DATA_RETRIEVED, communities);
  }

  async joinCommunity(req: Request, res: Response): Promise<void> {
    const userId = objectIdSchema.parse((req as CustomRequest).user._id);
    const communityId = objectIdSchema.parse(req.body.communityId);
    await this._communityCommand.joinCommunity({ userId, communityId,role :  (req as CustomRequest).user.role as TRole});
    ResponseHandler.success(res, SUCCESS_MESSAGES.JOINED_SUCESS);
  }

  async leaveCommunity(req: Request, res: Response): Promise<void> {
    const userId = objectIdSchema.parse((req as CustomRequest).user._id);
    const role = (req as CustomRequest).user.role
    const communityId = objectIdSchema.parse(req.params.communityId);
    await this._communityCommand.leaveCommunity({
      userId : userId,
      communityId : communityId,
      role : role as TRole
     });
    ResponseHandler.success(res, SUCCESS_MESSAGES.LEAVE_SUCCESS);
  }

  async getCommunityMembers(req: Request, res: Response): Promise<void> {
    const parsed = getCommunityMemberSchema.parse({...req.query,slug : req.params.slug})
    const members = await this._communityQuery.fetchCommuityMembers(parsed)
    ResponseHandler.success(res,SUCCESS_MESSAGES.DATA_RETRIEVED,members)
  }

  async createPost(req: Request, res: Response): Promise<void> {
    const {_id , role} = (req as CustomRequest).user
    const parsed = createPostSchema.parse({...req.body , userId : _id , role : role ,media : (req.files as { [fieldname: string]: Express.Multer.File[]} | undefined)?.media});
    const newPost = await this._communityPostUsecase.createPost(parsed)
    ResponseHandler.success(res,SUCCESS_MESSAGES.CREATED,newPost)
  }

  async getAllPosts(req: Request, res: Response): Promise<void> {
    const parsed = getAllPostSchema.parse(req.query)
    const userId = objectIdSchema.parse((req as CustomRequest).user._id)
    const posts = await this._communityPostQueryUsecase.getAllPost({...parsed,userId: userId});
    ResponseHandler.success(res,SUCCESS_MESSAGES.DATA_RETRIEVED,posts)
  }
  
  async getPostDetails(req: Request, res: Response): Promise<void> {
    const {postId} = req.params;
    const userId = (req as CustomRequest).user._id
    const parsed = getPostDetailsSchema.parse({...req.query,userId : userId , postId })
    const postDetails = await this._communityPostQueryUsecase.getPostDetails(parsed);
    ResponseHandler.success(res,SUCCESS_MESSAGES.DATA_RETRIEVED,postDetails)
  }

  async addComment(req: Request, res: Response): Promise<void> {
    const parsed = addCommentSchema.parse({...req.body,userId : (req as CustomRequest).user._id})
    await this._communityPostUsecase.addComment({...parsed,role : (req as CustomRequest).user.role as TRole})
    ResponseHandler.success(res,SUCCESS_MESSAGES.COMMENT_CREATED)
  }

  async fetchComments(req: Request, res: Response): Promise<void> {
    const {_id} = (req as CustomRequest).user;
    const parsed = getCommentsSchema.parse({...req.query,userId : _id})
    const comments = await this._communityPostQueryUsecase.getAllCommentsForUser(parsed)
    ResponseHandler.success(res,SUCCESS_MESSAGES.DATA_RETRIEVED,comments)
  }

  async editComment(req: Request, res: Response): Promise<void> {
    const parsed = editCommentSchema.parse(req.body)
    await this._communityPostUsecase.editComment(parsed)
    ResponseHandler.success(res,SUCCESS_MESSAGES.COMMENT_EDITED)
  }
  
  async deleteComment(req: Request, res: Response): Promise<void> {
    const commentId = objectIdSchema.parse(req.params.commentId)
    await this._communityPostUsecase.deleteComment(commentId)
    ResponseHandler.success(res,SUCCESS_MESSAGES.COMMENT_DELETED)
  }

  async getAllPostForUser(req: Request, res: Response): Promise<void> {
    const {_id} = (req as CustomRequest).user
    const parsed = getPostsSchema.parse({...req.query,userId : _id})
    const post = await this._communityPostQueryUsecase.getAllPostForUser(parsed)
    ResponseHandler.success(res,SUCCESS_MESSAGES.DATA_RETRIEVED,post)
  }

  async editPost(req: Request, res: Response): Promise<void> {
    const parsedData = editPostSchema.parse({...req.body,newImages : req.files})
    await this._communityPostUsecase.editPost(parsedData)
    ResponseHandler.success(res,SUCCESS_MESSAGES.UPDATE_SUCCESS)
  }

  async deleteCommunityPost(req: Request, res: Response): Promise<void> {
    const postId = objectIdSchema.parse(req.params.postId);
    await this._communityPostUsecase.deletePost(postId)
    ResponseHandler.success(res,SUCCESS_MESSAGES.DELETE_SUCCESS)
  }
}
