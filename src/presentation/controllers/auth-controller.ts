import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import {
  IGenerateTokenUsecase,
  IRegisterUserUsecase,
  ISendAuthEmailUsecase,
  IUserLoginUsecase,
  IVerifyOtpUsecase,
} from "../../domain/interfaces/usecase/auth-usecase.interfaces";
import {
  LoginInputDto,
  RegisterInputDto,
  SendOtpEmailInputDto,
  VerifyRegisterationDto,
} from "../dto/auth-dto";
import {
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../shared/constants/constants";
import { ResponseHandler } from "../../shared/utils/response-handler";
import { IAuthController } from "../../domain/interfaces/controller/auth-controller.interface";
import {
  userLoginSchema,
  userRegisterSchema,
  verifyOtpSchema,
} from "../../shared/utils/zod-validations/auth.schema";
    import { setAuthCookies } from "../../shared/utils/cookie-helper";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject("ISendAuthEmailUsecase")
    private _sendAuthEmailUsecase: ISendAuthEmailUsecase,
    @inject("IRegisterUserUsecase")
    private _registerUserUsecase: IRegisterUserUsecase,
    @inject("IVerifyOtpUsecase") private _verifyotpUsecase: IVerifyOtpUsecase,
    @inject("IUserLoginUsecase") private _loginUserUsecase: IUserLoginUsecase,
    @inject("IGenerateTokenUsecase")
    private _generateToken: IGenerateTokenUsecase
  ) {}

  async sendOtp(req: Request, res: Response): Promise<void> {
    const payload = req.body as SendOtpEmailInputDto;
    await this._sendAuthEmailUsecase.sendAuthEmail({
      email: payload.email,
      userRole: payload.role,
    });
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

    console.log("validated data : ", validatedData);
    const user = await this._loginUserUsecase.loginUser(validatedData);
    console.log("user data after login : ", user);

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

    console.log("user logged in: ", user);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  }
}
