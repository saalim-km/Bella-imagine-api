import { inject, injectable } from "tsyringe";
import { IVendorController } from "../../domain/interfaces/controller/vendor.controller";
import { IGetUserDetailsUsecase } from "../../domain/interfaces/usecase/admin-usecase.interface";
import { Request, Response } from "express";
import { objectIdSchema } from "../../shared/utils/zod-validations/validators/validations";
import { CustomRequest } from "../middlewares/auth.middleware";
import { ResponseHandler } from "../../shared/utils/response-handler";
import { SUCCESS_MESSAGES } from "../../shared/constants/constants";
import {
  clearAuthCookies,
  updateCookieWithAccessToken,
} from "../../shared/utils/cookie-helper";
import { IRefreshTokenUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { updateVendorProfileSchema } from "../../shared/utils/zod-validations/presentation/client.schema";
import { IVendorProfileUsecase } from "../../domain/interfaces/usecase/vendor-usecase.interface";

@injectable()
export class VendorController implements IVendorController {
  constructor(
    @inject("IGetUserDetailsUsecase")
    private _getUserDetailsUsecase: IGetUserDetailsUsecase,
    @inject("IRefreshTokenUsecase")
    private _refreshTokenUsecase: IRefreshTokenUsecase,
    @inject('IVendorProfileUsecase') private _vendorProfileUsecase : IVendorProfileUsecase
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

  async getVendorDetails(req: Request, res: Response): Promise<void> {
    const vendorId = objectIdSchema.parse((req as CustomRequest).user._id);
    const vendor = await this._getUserDetailsUsecase.getUserDetail({
      id: vendorId,
      role: "vendor",
    });
    ResponseHandler.success(res, SUCCESS_MESSAGES.DATA_RETRIEVED, vendor);
  }

  async updateVendorDetails(req: Request, res: Response): Promise<void> {
  const { _id } = (req as CustomRequest).user;

  // Safe extraction of files (may be undefined)
  const files = req.files as { [key: string]: Express.Multer.File[] } | undefined;
  const profileImage = files?.profileImage?.[0];
  const verificationDocument = files?.verificationDocument?.[0];
    const parsed = updateVendorProfileSchema.parse({
      ...req.body,
      vendorId: _id,
      profileImage,
      verificationDocument,
    });

    console.log('parsed data:', parsed);
    const vendor = await this._vendorProfileUsecase.updateVendorProfile(parsed)
    ResponseHandler.success(res,SUCCESS_MESSAGES.UPDATE_SUCCESS,vendor)
  }
}
