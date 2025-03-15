import { inject, injectable } from "tsyringe";
import { IResetPasswordController } from "../../../entities/controllerInterfaces/auth/reset-password-controller.interface";
import { IResetPasswordUsecase } from "../../../entities/usecaseIntefaces/auth/reset-password-usecase.interface";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";

@injectable()
export class ResetPasswordController implements IResetPasswordController {
  constructor(
    @inject("IResetPasswordUsecase")
    private resetPasswordUsecase: IResetPasswordUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
        console.log(req.body);
        await this.resetPasswordUsecase.execute(req.body)
        res.status(HTTP_STATUS.OK).json({success : true, message : SUCCESS_MESSAGES.UPDATE_SUCCESS})
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
