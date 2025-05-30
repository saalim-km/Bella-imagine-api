import { RegisterUserInput, SendOtpEmailInput, VerifyOtpInput } from "../../../application/auth/auth.types";
import { TRole } from "../../../shared/constants/constants";

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