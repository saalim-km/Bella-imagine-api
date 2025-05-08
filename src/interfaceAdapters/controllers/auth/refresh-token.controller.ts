import { Request, Response } from "express";
import { IRefreshTokenController } from "../../../entities/controllerInterfaces/auth/refresh-token-controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { inject, injectable } from "tsyringe";
import { IRefreshTokenUsecase } from "../../../entities/usecaseInterfaces/auth/refresh-token-usecase.interface";
import { updateCookieWithAccessToken } from "../../../shared/utils/cookie-helper.utils";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../../shared/constants";
import { ZodError } from "zod";
import { CustomError } from "../../../entities/utils/custom-error";

@injectable()
export class RefreshTokenController implements IRefreshTokenController {
  constructor(
    @inject("IRefreshTokenUsecase")
    private refreshTokenUsecase: IRefreshTokenUsecase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    console.log("------------------refresh token controller------------------");

    const user = (req as CustomRequest).user;
    console.log(user);

    const accessToken = this.refreshTokenUsecase.execute({
      _id: user._id,
      email: user.email,
      role: user.role,
      refreshToken: user.refresh_token,
    });
    console.log(`got new accesstoken ${accessToken}`);

    updateCookieWithAccessToken(res, accessToken, `${user.role}_access_token`);

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGES.OPERATION_SUCCESS });
  }
}
