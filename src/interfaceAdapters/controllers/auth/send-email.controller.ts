import { ISendEmailController } from "../../../entities/controllerInterfaces/auth/send-email.controller.interface";
import { Request, Response } from "express";
import { ISendEmailUseCase } from "../../../entities/usecaseIntefaces/auth/send-email-usecase.interface";
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
    try {

        
      console.log("-> in Send-Email-Controller ->>>>>>>>>>>>");
      console.log(req.body);
      
      const { email } = req.body;
      await this.sendEmailUsecase.execute(email);

      res
        .status(HTTP_STATUS.OK)
        .json({ success: true, message: SUCCESS_MESSAGES.OTP_SEND_SUCCESS });



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
