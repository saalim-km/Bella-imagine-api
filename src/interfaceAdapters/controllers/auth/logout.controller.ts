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
    try {
        console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<< in logout controller >>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      const user = (req as CustomRequest).user;
      const accessTokenName = `${user.role}_access_token`;
      const refreshTokenName = `${user.role}_refresh_token`;

      console.log(user);
      console.log(accessTokenName , refreshTokenName);
      clearAuthCookies(res, accessTokenName, refreshTokenName);
      res
        .status(HTTP_STATUS.OK)
        .json({ success: true, message: SUCCESS_MESSAGES.LOGOUT_SUCCESS });
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          message: err.message,
        }));
        console.log(errors);
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.VALIDATION_ERROR,
          errors,
        });
        return;
      }
      if (error instanceof CustomError) {
        console.log(error);
        res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
        return;
      }
      console.log(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
    }
  }
}
