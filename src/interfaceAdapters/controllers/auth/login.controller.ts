import { inject, injectable } from "tsyringe";
import { ILoginControllerInterface } from "../../../entities/controllerInterfaces/auth/login-controller.interface";
import { Request, Response } from "express";
import { ILogUseCaseIninterface } from "../../../entities/usecaseIntefaces/auth/login-usecase.interface";
import { LoginUserDto } from "../../../shared/dtos/user.dto";
import { userLoginSchema } from "./validation/login-validation.schema";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IJwtservice } from "../../../entities/services/jwt.service";

@injectable()
export class LoginController implements ILoginControllerInterface {
  constructor(
    @inject("ILogUseCaseIninterface") private loginUseCase: ILogUseCaseIninterface,
    @inject("IJwtservice") private jwtService : IJwtservice
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    const { role } = req.body as LoginUserDto;
    const schema = userLoginSchema[role];

    if (!schema) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
      return;
    }

    const validated = schema.parse(req.body);

    const {_id,email} = await this.loginUseCase.execute(validated);
    
    console.log(user)

    const token = this.jwtService.generateAccessToken({_id,email,role})
  }
}
