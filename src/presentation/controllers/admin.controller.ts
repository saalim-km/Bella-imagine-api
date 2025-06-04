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
import { PaginationQueryDto, UserDetailsDto, UserQueryParams } from "../dto/admin.dto";
import { IClient } from "../../domain/models/client";
import { IGetUserDetailsUsecase, IGetUsersUsecase } from "../../domain/interfaces/usecase/admin-usecase.interface";
import { UserDetailsInput } from "../../domain/interfaces/usecase/types/admin.types";
import { getUsersQuerySchema } from "../../shared/utils/zod-validations/presentation/dto.schema";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject("IRefreshTokenUsecase")
    private _refreshTokenUsecase: IRefreshTokenUsecase,
    @inject('IGetUsersUsecase') private _getUsersUsecase : IGetUsersUsecase,
    @inject('IGetUserDetailsUsecase') private _getUserDetailsUsecase : IGetUserDetailsUsecase
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
    const payload = getUsersQuerySchema.parse(req.query)
    const users = await this._getUsersUsecase.getUsers(payload)
    ResponseHandler.success(res,SUCCESS_MESSAGES.DATA_RETRIEVED,users)
  }

  async getUserDetails(req: Request, res: Response) : Promise<void> {
    const {id , role} = req.query as UserDetailsDto;
    const user = await this._getUserDetailsUsecase.getUserDetail({
        id : id!,
        role : role!
    })

    ResponseHandler.success(res , SUCCESS_MESSAGES.DATA_RETRIEVED , user)
  }

  async getVendoRequests(req: Request, res: Response): Promise<void> {
    const { page, limit , } = req.query as UserQueryParams;
        const filter: UserQueryParams = {
      search: req.query.search as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      isblocked: req.query.isblocked
        ? req.query.isblocked === "true"
        : undefined,
      createdAt: req.query.createdAt
        ? parseInt(req.query.createdAt as string)
        : undefined,
    };
  }
}
