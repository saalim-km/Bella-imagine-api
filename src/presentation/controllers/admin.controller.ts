import { inject, injectable } from "tsyringe";
import { IAdminController } from "../../domain/interfaces/controller/admin-controller.interface";
import { Request, Response } from "express";
import { CustomRequest } from "../middlewares/auth.middleware";
import {
  clearAuthCookies,
  updateCookieWithAccessToken,
} from "../../shared/utils/cookie-helper";
import { ResponseHandler } from "../../shared/utils/response-handler";
import { SUCCESS_MESSAGES } from "../../shared/constants/constants";
import { IRefreshTokenUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import {
  ICategoryManagementUsecase,
  IGetUserDetailsUsecase,
  IGetUsersUsecase,
  IGetVendorRequestUsecase,
  IUserManagementUsecase,
} from "../../domain/interfaces/usecase/admin-usecase.interface";
import { createCategorySchema, getCategoriesSchema, getCatJoinRequestsSchema, getUserDetailsQuerySchema, getUsersQuerySchema, getVendorRequestsQuerySchema, updateUserBlockStatusSchema, updateVendorRequestSchema } from "../../shared/utils/zod-validations/presentation/admin.schema";
import { objectIdSchema } from "../../shared/utils/zod-validations/validators/validations";
import { UpdateCategory } from "../../domain/interfaces/usecase/types/admin.types";


@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject("IRefreshTokenUsecase")
    private _refreshTokenUsecase: IRefreshTokenUsecase,
    @inject("IGetUsersUsecase") private _getUsersUsecase: IGetUsersUsecase,
    @inject("IGetUserDetailsUsecase")
    private _getUserDetailsUsecase: IGetUserDetailsUsecase,
    @inject('IGetVendorRequestUsecase') private _getVendorRequestsUsecase : IGetVendorRequestUsecase,
    @inject('IUserManagementUsecase') private _userManagmentUsecase : IUserManagementUsecase,
    @inject('ICategoryManagementUsecase') private _categoryManagmentUsecase : ICategoryManagementUsecase
  ) {}

  async logout(req: Request, res: Response): Promise<void> {
    const user = (req as CustomRequest).user;
    const accessTokenName = `${user.role}_access_token`;
    const refreshTokenName = `${user.role}_refresh_token`;

    clearAuthCookies(res, accessTokenName, refreshTokenName);
    ResponseHandler.success(res, SUCCESS_MESSAGES.LOGOUT_SUCCESS);
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const user = (req as CustomRequest).user;
    const accessToken = await this._refreshTokenUsecase.execute({
      _id: user._id,
      email: user.email,
      role: user.role,
      refreshToken: user.refreshToken,
    });

    updateCookieWithAccessToken(res, accessToken, `${user.role}_access_token`);
    ResponseHandler.success(res, SUCCESS_MESSAGES.REFRESH_TOKEN_SUCCESS, {
      accessToken,
    });
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    const parsed = getUsersQuerySchema.parse(req.query);
    const users = await this._getUsersUsecase.getUsers(parsed);
    ResponseHandler.success(res, SUCCESS_MESSAGES.DATA_RETRIEVED, users);
  }

  async getUserDetails(req: Request, res: Response): Promise<void> {
    const parsed = getUserDetailsQuerySchema.parse(req.query)
    const user = await this._getUserDetailsUsecase.getUserDetail(parsed);
    ResponseHandler.success(res, SUCCESS_MESSAGES.DATA_RETRIEVED, user);
  }

  async getVendoRequests(req: Request, res: Response): Promise<void> {
    const parsed = getVendorRequestsQuerySchema.parse(req.query)
    const vendors = await this._getVendorRequestsUsecase.getVendorRequests(parsed)
    ResponseHandler.success(res,SUCCESS_MESSAGES.DATA_RETRIEVED,vendors)
  }

  async updateBlockStatus(req: Request, res: Response): Promise<void> {
    const parsed  = updateUserBlockStatusSchema.parse(req.query)
    await this._userManagmentUsecase.updateBlockStatus(parsed)
    ResponseHandler.success(res,SUCCESS_MESSAGES.UPDATE_SUCCESS)
  }

  async updateVendorRequest(req: Request, res: Response): Promise<void> {
    const parsed = updateVendorRequestSchema.parse(req.query);
    await this._userManagmentUsecase.updateVendorRequest(parsed)
    ResponseHandler.success(res,SUCCESS_MESSAGES.UPDATE_SUCCESS);
  }

  async getCategories(req: Request, res: Response): Promise<void> {
    const parsed = getCategoriesSchema.parse(req.query)
    const categories = await this._categoryManagmentUsecase.getCategories(parsed)
    ResponseHandler.success(res,SUCCESS_MESSAGES.DATA_RETRIEVED,categories)
  }

  async updateCategoryStatus(req: Request, res: Response): Promise<void> {
    const parsed = objectIdSchema.parse(req.query.id)
    await this._categoryManagmentUsecase.updateCategoryStatus(parsed)
    ResponseHandler.success(res,SUCCESS_MESSAGES.UPDATE_SUCCESS)
  }

  async createNewCategory(req: Request, res: Response): Promise<void> {
    const parsed = createCategorySchema.parse(req.body)
    await this._categoryManagmentUsecase.createNewCategory(parsed)
    ResponseHandler.success(res,SUCCESS_MESSAGES.CREATED)
  }

  async getCatJoinRequests(req: Request, res: Response): Promise<void> {
    const parsed = getCatJoinRequestsSchema .parse(req.query)
    const data = await this._categoryManagmentUsecase.getCatJoinRequest(parsed)
    ResponseHandler.success(res,SUCCESS_MESSAGES.CREATED,data)
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    console.log(req.body);
    await this._categoryManagmentUsecase.updateCategory(req.body as UpdateCategory)
    ResponseHandler.success(res,SUCCESS_MESSAGES.UPDATE_SUCCESS)
  }

  async updateCatRequest(req: Request, res: Response): Promise<void> {
    await this._categoryManagmentUsecase.updateCatJoinRequest(req.body)
    ResponseHandler.success(res,SUCCESS_MESSAGES.UPDATE_SUCCESS)
  }
}
