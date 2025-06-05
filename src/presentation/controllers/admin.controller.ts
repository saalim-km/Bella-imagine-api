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
  IGetUserDetailsUsecase,
  IGetUsersUsecase,
  IGetVendorRequestUsecase,
  IManageUserBlockStatusUseCase,
} from "../../domain/interfaces/usecase/admin-usecase.interface";
import { getUserDetailsQuerySchema, getUsersQuerySchema, getVendorRequestsQuerySchema, updateUserBlockStatusSchema, updateVendorRequestSchema } from "../../shared/utils/zod-validations/presentation/dto.schema";


@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject("IRefreshTokenUsecase")
    private _refreshTokenUsecase: IRefreshTokenUsecase,
    @inject("IGetUsersUsecase") private _getUsersUsecase: IGetUsersUsecase,
    @inject("IGetUserDetailsUsecase")
    private _getUserDetailsUsecase: IGetUserDetailsUsecase,
    @inject('IGetVendorRequestUsecase') private _getVendorRequestsUsecase : IGetVendorRequestUsecase,
    @inject('IManageUserBlockStatusUseCase') private _updateUserBlockStatusUsecase : IManageUserBlockStatusUseCase
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
    const parsed = updateUserBlockStatusSchema.parse(req.query)
    await this._updateUserBlockStatusUsecase.blockUser(parsed)
    ResponseHandler.success(res,SUCCESS_MESSAGES.UPDATE_SUCCESS)
  }

  async updateVendorRequest(req: Request, res: Response): Promise<void> {
    console.log(req.query);
    const parsed = updateVendorRequestSchema.parse(req.query);
    
  }
}
