import { Request, Response } from "express";
import { IGoogleLoginController } from "../../../entities/controllerInterfaces/auth/google-login-controller.interface";
import { inject, injectable } from "tsyringe";
import { IGoogleUseCase } from "../../../entities/usecaseIntefaces/auth/google-login-usecase.interface";
import { IGenerateTokenUsecase } from "../../../entities/usecaseIntefaces/auth/generate-token-usecase.interface";
import { custom, ZodError } from "zod";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";
import { setAuthCookies } from "../../../shared/utils/cookie-helper.utils";
import { privateDecrypt } from "crypto";

@injectable()
export class GoogleLoginController implements IGoogleLoginController {
  constructor(
    @inject("IGoogleUseCase") private googleLoginUsecase: IGoogleUseCase,
    @inject("IGenerateTokenUsecase") private generateTokenusecase : IGenerateTokenUsecase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    try {
      console.log("------------------------ google login controller---------------------------");
      console.log(req.body);

      const { credential, role, client_id } = req.body;
      console.log(role);
      const user = await this.googleLoginUsecase.execute(
        credential,
        client_id,
        role
      );
      console.log(user);


      if (!user._id || !user.email || !user.role) {
        throw new Error("User ID, email, or role is missing");
      }
      
      const userId = user._id?.toString();

      const accessTokenName = `${user.role}_access_token`;
      const refreshTokenName = `${user.role}_refresh_token`;

      const tokens = await this.generateTokenusecase.execute({_id : userId , email : user.email , role : role});
      console.log('token generated');
      console.log(tokens);

      setAuthCookies(res,tokens.accessToken,tokens.refreshToken,accessTokenName,refreshTokenName)

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'User successfully authenticated',
        user: {
          _id: userId,
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
