import { LoginUserInput, LoginUserOuput, RegisterUserInput, SendOtpEmailInput, VerifyOtpInput } from "../../../application/auth/auth.types";
import { TRole } from "../../../shared/constants/constants";
import { JwtOutput, TJwtPayload } from "../../types/auth.types";

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
    generateToken (data : TJwtPayload) : Promise<JwtOutput>
}