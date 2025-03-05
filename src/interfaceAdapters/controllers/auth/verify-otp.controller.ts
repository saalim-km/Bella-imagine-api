import { Request, Response } from "express";
import { IVerifyOTPController } from "../../../entities/controllerInterfaces/auth/verfiy-otp-controller.interface";
import { IVerifyOTPUsecase } from "../../../entities/usecaseIntefaces/auth/verify-otp-usecase.interface.";
import { inject, injectable } from "tsyringe";
import { emailOtpVerifySchema } from "./validation/email-otp-validation.schema";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants";
import { ZodError } from "zod";
import { CustomError } from "../../../entities/utils/custom-error";

@injectable()
export class VerifyOTPController implements IVerifyOTPController {
  constructor(
    @inject("IVerifyOTPUsecase") private verifyOtpUsecase: IVerifyOTPUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {


      console.log("->>>>>>>>>>>>>>> In Verify-Otp-controller->>>>>>>>>>>>>");
      console.log(req.body);

      const { email, otp } = req.body;

      const validated = emailOtpVerifySchema.parse({ email, otp });

      await this.verifyOtpUsecase.execute(validated);
      res
        .status(HTTP_STATUS.OK)
        .json({
          success: true,
          message: SUCCESS_MESSAGES.VERIFICATION_SUCCESS,
        });



    } catch (error) {


      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          message: err.message,
        }));

        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.VALIDATION_ERROR,
          errors,
        });
        return;
      }

      if (error instanceof CustomError) {
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
