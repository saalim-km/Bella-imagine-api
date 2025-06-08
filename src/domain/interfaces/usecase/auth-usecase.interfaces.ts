import { JwtOutput, TJwtPayload } from "../../types/auth.types";
import { LoginUserInput, LoginUserOuput, RegisterUserInput, ResetPasswordInput, SendOtpEmailInput, VerifyOtpInput } from "./types/auth.types";

export interface ISendAuthEmailUsecase {
    sendAuthEmail(input : SendOtpEmailInput): Promise<void>
}

export interface IRegisterUserUsecase {
    register(input : RegisterUserInput) :  Promise<void>
}

export interface IRegisterUserStrategy {
    register(input : RegisterUserInput) :  Promise<void>
}

export interface IVerifyOtpUsecase {
    verifyOtp(input : VerifyOtpInput) : Promise<void>
}

export interface IUserLoginUsecase {
    loginUser(input : LoginUserInput) : Promise<LoginUserOuput>
}

export interface ILoginUserStrategy {
    login(input : LoginUserInput) : Promise<LoginUserOuput>
}

export interface IGenerateTokenUsecase {
    generateToken (input : TJwtPayload) : Promise<JwtOutput>
}

export interface IForgotPasswordUsecase {
    forgotPassword(input : SendOtpEmailInput) : Promise<void>
}

export interface IResetPasswordUsecase {
    resetPassword(input : ResetPasswordInput) : Promise<void>
}

export interface IResetPasswordStrategy {
    resetPassword(input : ResetPasswordInput) : Promise<void>
}