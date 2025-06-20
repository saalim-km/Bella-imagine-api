import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import {
  IForgotPasswordUsecase,
  IGenerateTokenUsecase,
  IGoogleLoginUsecase,
  IRegisterUserUsecase,
  IResetPasswordUsecase,
  ISendAuthEmailUsecase,
  IUserLoginUsecase,
  IVerifyOtpUsecase,
} from "../../domain/interfaces/usecase/auth-usecase.interfaces";
import {
  LoginInputDto,
  RegisterInputDto,
  ResetPasswordDto,
  SendOtpEmailInputDto,
  VerifyRegisterationDto,
} from "../dto/auth.dto";
import {
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../shared/constants/constants";
import { ResponseHandler } from "../../shared/utils/helper/response-handler";
import { IAuthController } from "../../domain/interfaces/controller/auth-controller.interface";
import {
  resetPasswordSchema,
  userLoginSchema,
  userRegisterSchema,
  verifyOtpSchema,
} from "../../shared/utils/zod-validations/presentation/auth.schema";
    import { setAuthCookies } from "../../shared/utils/helper/cookie-helper";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject("ISendAuthEmailUsecase")
    private _sendAuthEmailUsecase: ISendAuthEmailUsecase,
    @inject("IRegisterUserUsecase")
    private _registerUserUsecase: IRegisterUserUsecase,
    @inject("IVerifyOtpUsecase") private _verifyotpUsecase: IVerifyOtpUsecase,
    @inject("IUserLoginUsecase") private _loginUserUsecase: IUserLoginUsecase,
    @inject('IForgotPasswordUsecase') private _forgotPassUsecase : IForgotPasswordUsecase,
    @inject('IGenerateTokenUsecase') private _generateToken : IGenerateTokenUsecase,
    @inject('IResetPasswordUsecase') private _resetPasswordUsecase : IResetPasswordUsecase,
    @inject('IGoogleLoginUsecase') private _googleLogin : IGoogleLoginUsecase
  ) {}

  async sendOtp(req: Request, res: Response): Promise<void> {
    const payload = req.body as SendOtpEmailInputDto;
    await this._sendAuthEmailUsecase.sendAuthEmail(payload);
    ResponseHandler.success(res, SUCCESS_MESSAGES.OTP_SEND_SUCCESS);
  }

  async register(req: Request, res: Response): Promise<void> {
    const { role } = req.body as RegisterInputDto;
    const schema = userRegisterSchema[role];
    const validatedData = schema.parse(req.body);

    await this._registerUserUsecase.register(validatedData);
    ResponseHandler.success(res, SUCCESS_MESSAGES.CREATED, null, 201);
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    const payload = req.body as VerifyRegisterationDto;
    const validatedData = verifyOtpSchema.parse(payload);

    await this._verifyotpUsecase.verifyOtp(validatedData);
    ResponseHandler.success(res, SUCCESS_MESSAGES.OTP_VERIFY_SUCCESS);
  }

  async login(req: Request, res: Response): Promise<void> {
    const payload = req.body as LoginInputDto;
    const validatedData = userLoginSchema.parse(payload);

    const user = await this._loginUserUsecase.loginUser(validatedData);

    const tokens = await this._generateToken.generateToken({
      _id: user._id,
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

    ResponseHandler.success(res , SUCCESS_MESSAGES.LOGIN_SUCCESS,user)
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const payload = req.body as SendOtpEmailInputDto;
    console.log('parsed data : ',payload);
    await this._forgotPassUsecase.forgotPassword(payload)
    ResponseHandler.success(res , SUCCESS_MESSAGES.OTP_SEND_SUCCESS)
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const payload = req.body as ResetPasswordDto;
    const validatedData = resetPasswordSchema.parse(payload)
    await this._resetPasswordUsecase.resetPassword(validatedData)

    ResponseHandler.success(res,SUCCESS_MESSAGES.UPDATE_SUCCESS)
  }

  async googleLogin(req: Request, res: Response): Promise<void> {
        console.log('in google login controller');
      const { credential, role, client_id } = req.body; 
      const user = await this._googleLogin.login({
        client_id : client_id,
        credential : credential,
        role : role
      }
      );


      if (!user._id || !user.email || !user.role) {
        throw new Error("User ID, email, or role is missing");
      }
      
      const userId = user._id?.toString();

      const accessTokenName = `${user.role}_access_token`;
      const refreshTokenName = `${user.role}_refresh_token`;

      const tokens = await this._generateToken.generateToken({_id : userId , email : user.email , role : role});

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