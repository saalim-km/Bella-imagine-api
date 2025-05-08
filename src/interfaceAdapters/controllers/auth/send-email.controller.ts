import { ISendEmailController } from "../../../entities/controllerInterfaces/auth/send-email.controller.interface";
import { Request, Response } from "express";
import { ISendEmailUseCase } from "../../../entities/usecaseInterfaces/auth/send-email-usecase.interface";
import { inject, injectable } from "tsyringe";
import { userDTO } from "../../../shared/dtos/user.dto";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../../shared/constants";
import { ZodError } from "zod";
import { CustomError } from "../../../entities/utils/custom-error";

@injectable()
export class SendEmailController implements ISendEmailController {
  constructor(
    @inject("ISendEmailUseCase") private sendEmailUsecase: ISendEmailUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    console.log("-> in Send-Email-Controller ->>>>>>>>>>>>");
    console.log(req.body);

    const { email } = req.body;
    await this.sendEmailUsecase.execute(email);

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGES.OTP_SEND_SUCCESS });
  }
}
