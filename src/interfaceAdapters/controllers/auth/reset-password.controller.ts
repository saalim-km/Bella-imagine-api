import { inject, injectable } from "tsyringe";
import { IResetPasswordController } from "../../../entities/controllerInterfaces/auth/reset-password-controller.interface";
import { IResetPasswordUsecase } from "../../../entities/usecaseInterfaces/auth/reset-password-usecase.interface";
import { Request, Response } from "express";
import { ZodError } from "zod";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";

@injectable()
export class ResetPasswordController implements IResetPasswordController {
  constructor(
    @inject("IResetPasswordUsecase")
    private resetPasswordUsecase: IResetPasswordUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    console.log(req.body);
    await this.resetPasswordUsecase.execute(req.body);
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGES.UPDATE_SUCCESS });
  }
}
