import { inject, injectable } from "tsyringe";
import { IRegisterController } from "../../../entities/controllerInterfaces/auth/register-controller.interface";
import { IRegisterUsecase } from "../../../entities/usecaseInterfaces/auth/register-usecase.interface";
import { Request, Response } from "express";
import { userDTO } from "../../../shared/dtos/user.dto";
import { userSchema } from "./validation/signup-validation.schema";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";
import { ZodError } from "zod";

@injectable()
export class RegisterController implements IRegisterController {
  constructor(
    @inject("IRegisterUsecase")
    private registerUsecase: IRegisterUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    console.log("entered register controller");
    console.log(req.body);
    const { role } = req.body as userDTO;

    const schema = userSchema[role];

    if (!schema) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
      return;
    }

    const validatedData = schema.parse(req.body);
    await this.registerUsecase.execute(validatedData);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
    });
  }
}
