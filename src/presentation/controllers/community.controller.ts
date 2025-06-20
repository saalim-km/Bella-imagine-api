import { inject, injectable } from "tsyringe";
import { ICommunityController } from "../../domain/interfaces/controller/community-controller.interface";
import {
  ICommunityCommandUsecase,
  ICommunityQueryUsecase,
} from "../../domain/interfaces/usecase/community-usecase.interface";
import { Request, Response } from "express";
import {
  createCommunitySchema,
  fetchCommBySlugSchema,
  fetchCommunitySchema,
  updateCommuitySchema,
} from "../../shared/utils/zod-validations/presentation/community.schema";
import { ResponseHandler } from "../../shared/utils/helper/response-handler";
import { SUCCESS_MESSAGES } from "../../shared/constants/constants";
import { CustomRequest } from "../middlewares/auth.middleware";
import { FetchAllCommunitiesSchema } from "../../shared/utils/zod-validations/presentation/client.schema";
import { objectIdSchema } from "../../shared/utils/zod-validations/validators/validations";
import { getCommunityMemberSchema } from "../../shared/utils/zod-validations/presentation/admin.schema";

@injectable()
export class CommunityController implements ICommunityController {
  constructor(
    @inject("ICommunityCommandUsecase")
    private _communityCommand: ICommunityCommandUsecase,
    @inject("ICommunityQueryUsecase")
    private _communityQuery: ICommunityQueryUsecase
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
    console.log("updatecommunity controller");
    console.log(req.body);
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
    const userId = objectIdSchema.parse((req as CustomRequest).user._id)
    const parsed = FetchAllCommunitiesSchema.parse(req.query);
    const communities = await this._communityQuery.fetchAllCommunities({...parsed,userId : userId})
    ResponseHandler.success(res,SUCCESS_MESSAGES.DATA_RETRIEVED,communities)
  }

  async joinCommunity(req: Request, res: Response): Promise<void> {
    const userId = objectIdSchema.parse((req as CustomRequest).user._id)
    const communityId = objectIdSchema.parse(req.body.communityId)
    await this._communityCommand.joinCommunity({userId,communityId})
    ResponseHandler.success(res,SUCCESS_MESSAGES.JOINED_SUCESS)
  }

  async leaveCommunity(req: Request, res: Response): Promise<void> {
    const userId = objectIdSchema.parse((req as CustomRequest).user._id)
    const communityId = objectIdSchema.parse(req.params.communityId)
    await this._communityCommand.leaveCommunity({userId,communityId})
    ResponseHandler.success(res,SUCCESS_MESSAGES.LEAVE_SUCCESS)
  }

  async getCommunityMembers(req: Request, res: Response): Promise<void> {
    console.log(req.params);
    const communityId = objectIdSchema.parse(req.params.communityId)
    const parsed = getCommunityMemberSchema.parse(req.query)
    const members = await this._communityQuery.fetchCommuityMembers({...parsed,communityId : communityId})
  }
}
