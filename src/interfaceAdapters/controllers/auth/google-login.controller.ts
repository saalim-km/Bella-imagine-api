import { Request, Response } from "express";
import { IGoogleLoginController } from "../../../entities/controllerInterfaces/auth/google-login-controller.interface";
import { inject, injectable } from "tsyringe";
import { IGoogleUseCase } from "../../../entities/usecaseInterfaces/auth/google-login-usecase.interface";
import { IGenerateTokenUsecase } from "../../../entities/usecaseInterfaces/auth/generate-token-usecase.interface";
import { custom, ZodError } from "zod";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";
import { setAuthCookies } from "../../../shared/utils/cookie-helper.utils";

@injectable()
export class GoogleLoginController implements IGoogleLoginController {
  constructor(
    @inject("IGoogleUseCase") private googleLoginUsecase: IGoogleUseCase,
    @inject("IGenerateTokenUsecase") private generateTokenusecase : IGenerateTokenUsecase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
      console.log('in google login controller');
      const { credential, role, client_id } = req.body; 
      const user = await this.googleLoginUsecase.execute(
        credential,
        client_id,
        role
      );


      if (!user._id || !user.email || !user.role) {
        throw new Error("User ID, email, or role is missing");
      }
      
      const userId = user._id?.toString();

      const accessTokenName = `${user.role}_access_token`;
      const refreshTokenName = `${user.role}_refresh_token`;

      const tokens = await this.generateTokenusecase.execute({_id : userId , email : user.email , role : role});

      setAuthCookies(res,tokens.accessToken,tokens.refreshToken,accessTokenName,refreshTokenName)

      console.log('logged in user',user);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'User successfully authenticated',
        user: {
          _id: userId,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar : user.avatar
        },
      });
  }
}
