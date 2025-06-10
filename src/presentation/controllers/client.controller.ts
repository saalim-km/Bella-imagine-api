import { inject, injectable } from "tsyringe";
import { IClientController } from "../../domain/interfaces/controller/client.controller";
import { Request, Response } from "express";
import { CustomRequest } from "../middlewares/auth.middleware";
import {
  clearAuthCookies,
  updateCookieWithAccessToken,
} from "../../shared/utils/cookie-helper";
import { ResponseHandler } from "../../shared/utils/response-handler";
import { SUCCESS_MESSAGES } from "../../shared/constants/constants";
import { IRefreshTokenUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { ICategoryManagementUsecase } from "../../domain/interfaces/usecase/admin-usecase.interface";
import { getVendorDetailsSchema, getVendorsSchema } from "../../shared/utils/zod-validations/presentation/client.schema";
import { IVendorBrowsingUseCase } from "../../domain/interfaces/usecase/client-usecase.interface";
import { objectIdSchema } from "../../shared/utils/zod-validations/validators/validations";

@injectable()
export class ClientController implements IClientController {
  constructor(
    @inject("IRefreshTokenUsecase")
    private _refreshTokenUsecase: IRefreshTokenUsecase,
    @inject('ICategoryManagementUsecase') private _categoryManagementUsecase : ICategoryManagementUsecase,
    @inject("IVendorBrowsingUseCase") private _vendorBrowsingUsecase : IVendorBrowsingUseCase
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

  async getVendors(req: Request, res: Response): Promise<void> {
    const parsed = getVendorsSchema.parse(req.query)
    const vendors = await this._vendorBrowsingUsecase.fetchAvailableVendors(parsed)
    ResponseHandler.success(res,SUCCESS_MESSAGES.DATA_RETRIEVED,vendors)
  }

  async getCategories(req: Request, res: Response): Promise<void> {
    const categories = await this._categoryManagementUsecase.getCategories({limit : 10 , page : 1})
    ResponseHandler.success(res,SUCCESS_MESSAGES.DATA_RETRIEVED,categories)
  }

  async getVendorDetails(req: Request, res: Response): Promise<void> {
    const parsed = getVendorDetailsSchema.parse(req.query);
    const vendorId = objectIdSchema.parse(req.params.vendorId)
    const vendor = await this._vendorBrowsingUsecase.fetchVendorProfileById({...parsed,vendorId
       : vendorId
    })
    console.log(vendor);
    ResponseHandler.success(res,SUCCESS_MESSAGES.DATA_RETRIEVED,vendor)
  }
}
