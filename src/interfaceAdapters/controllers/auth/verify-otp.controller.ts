import { Request, Response } from "express";
import { IVerifyOTPController } from "../../../entities/controllerInterfaces/auth/verfiy-otp-controller.interface";
import { IVerifyOTPUsecase } from "../../../entities/usecaseInterfaces/auth/verify-otp-usecase.interface.";
import { inject, injectable } from "tsyringe";
import { emailOtpVerifySchema } from "./validation/email-otp-validation.schema";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../../shared/constants";

@injectable()
export class VerifyOTPController implements IVerifyOTPController {
  constructor(
    @inject("IVerifyOTPUsecase") private verifyOtpUsecase: IVerifyOTPUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    console.log("->>>>>>>>>>>>>>> In Verify-Otp-controller->>>>>>>>>>>>>");
    console.log(req.body);

    const { email, otp } = req.body;

    const validated = emailOtpVerifySchema.parse({ email, otp });

    await this.verifyOtpUsecase.execute(validated);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.VERIFICATION_SUCCESS,
    });
  }
}
