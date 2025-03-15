import { inject, injectable } from "tsyringe";
import { IForgotPasswordSendOtpController } from "../../../entities/controllerInterfaces/auth/forgot-password-send-otp-controller.interface";
import { IForgotPassWordSendOtpUsecase } from "../../../entities/usecaseIntefaces/auth/forgot-password-send-otp-usecase.interfac";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";

@injectable()
export class ForgotPasswordSendOtpController
  implements IForgotPasswordSendOtpController
{
  constructor(
    @inject("IForgotPassWordSendOtpUsecase")
    private forgotPasswordSendOtpUsecase: IForgotPassWordSendOtpUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body);
      await this.forgotPasswordSendOtpUsecase.execute(req.body.email,req.body.userType)
      res.status(HTTP_STATUS.OK).json({success : true , message :SUCCESS_MESSAGES.OTP_SEND_SUCCESS})
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
