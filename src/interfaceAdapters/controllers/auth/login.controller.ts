import { inject, injectable } from "tsyringe";
import { ILoginControllerInterface } from "../../../entities/controllerInterfaces/auth/login-controller.interface";
import { Request, Response } from "express";
import { ILogUseCaseIninterface } from "../../../entities/usecaseInterfaces/auth/login-usecase.interface";
import { LoginUserDto } from "../../../shared/dtos/user.dto";
import { userLoginSchema } from "./validation/login-validation.schema";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../../shared/constants";
import { IGenerateTokenUsecase } from "../../../entities/usecaseInterfaces/auth/generate-token-usecase.interface";
import { setAuthCookies } from "../../../shared/utils/cookie-helper.utils";
import { ZodError } from "zod";
import { CustomError } from "../../../entities/utils/custom-error";

@injectable()
export class LoginController implements ILoginControllerInterface {
  constructor(
    @inject("ILogUseCaseIninterface")
    private loginUseCase: ILogUseCaseIninterface,
    @inject("IGenerateTokenUsecase")
    private generateTokenUsecase: IGenerateTokenUsecase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    try {


      console.log("from login controller : ");
      console.log(req.body);
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

      const user = await this.loginUseCase.execute(validated);

      console.log(user);

      if(!user) {
        throw new CustomError("user not found please sign up" , HTTP_STATUS.NOT_FOUND)
      }

      if (!user._id || !user.email || !user.role) {
        throw new Error("User ID, email, or role is missing");
      }

      const userId = user._id.toString();
      const tokens = await this.generateTokenUsecase.execute({
        _id: userId,
        email: user.email,
        role: user.role,
      });

      const accessTokenName = `${user.role}_access_token`;
      const refreshTokenName = `${user.role}_refresh_token`;

      setAuthCookies(
        res,
        tokens.accessToken,
        tokens.refreshToken,
        accessTokenName,
        refreshTokenName
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });


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
