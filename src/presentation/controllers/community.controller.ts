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
import { ResponseHandler } from "../../shared/utils/response-handler";
import { SUCCESS_MESSAGES } from "../../shared/constants/constants";
import { CustomRequest } from "../middlewares/auth.middleware";

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
      coverImage: files?.coverImage && files.coverImage.length > 0 ? files.coverImage[0] : undefined,
      iconImage: files?.iconImage && files.iconImage.length > 0 ? files.iconImage[0] : undefined,
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
    const {_id} = (req as CustomRequest).user
    const parsed = fetchCommBySlugSchema.parse({slug : req.params.slug , userId : _id})
    const community = await this._communityQuery.fetchCommunityDetailsBySlug(parsed)
    ResponseHandler.success(res, SUCCESS_MESSAGES.DATA_RETRIEVED, community);
  }
  
  async updateCommunity(req: Request, res: Response): Promise<void> {
    console.log('updatecommunity controller');
    console.log(req.body);
        const files = req.files as
      | { [key: string]: Express.Multer.File[] }
      | undefined;
      
    const parsed = updateCommuitySchema.parse({
      ...req.body,
      coverImage: files?.coverImage && files.coverImage.length > 0 ? files.coverImage[0] : undefined,
      iconImage: files?.iconImage && files.iconImage.length > 0 ? files.iconImage[0] : undefined,
    });
    await this._communityCommand.updateCommunity(parsed)
    ResponseHandler.success(res,SUCCESS_MESSAGES.UPDATE_SUCCESS)
  }
}
