import { inject, injectable } from "tsyringe";
import { ILogoutController } from "../../../entities/controllerInterfaces/auth/logout-controller.interface";
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { clearAuthCookies } from "../../../shared/utils/cookie-helper.utils";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../../shared/constants";
import { ZodError } from "zod";
import { CustomError } from "../../../entities/utils/custom-error";

@injectable()
export class LogoutController implements ILogoutController {
  async handle(req: Request, res: Response): Promise<void> {
    console.log(
      "<<<<<<<<<<<<<<<<<<<<<<<<<<< in logout controller >>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
    );
    const user = (req as CustomRequest).user;
    console.log(user);
    const accessTokenName = `${user.role}_access_token`;
    const refreshTokenName = `${user.role}_refresh_token`;

    console.log(user);
    console.log(accessTokenName, refreshTokenName);
    clearAuthCookies(res, accessTokenName, refreshTokenName);
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGES.LOGOUT_SUCCESS });
  }
}
