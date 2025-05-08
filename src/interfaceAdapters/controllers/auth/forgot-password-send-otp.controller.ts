import { inject, injectable } from "tsyringe";
import { IForgotPasswordSendOtpController } from "../../../entities/controllerInterfaces/auth/forgot-password-send-otp-controller.interface";
import { IForgotPassWordSendOtpUsecase } from "../../../entities/usecaseInterfaces/auth/forgot-password-send-otp-usecase.interfac";
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
      console.log(req.body);
      await this.forgotPasswordSendOtpUsecase.execute(req.body.email,req.body.userType)
      res.status(HTTP_STATUS.OK).json({success : true , message :SUCCESS_MESSAGES.OTP_SEND_SUCCESS})
  }
}
