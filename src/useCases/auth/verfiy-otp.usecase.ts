import { inject, injectable } from "tsyringe";
import { IOtpService } from "../../entities/services/otp-service.interface";
import { IVerifyOTPUsecase } from "../../entities/usecaseInterfaces/auth/verify-otp-usecase.interface.";
import { CustomError } from "../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

export interface resultOtpVerify {
    success : boolean,
    message : string
}

@injectable()
export class VerifyOTPUsecase implements IVerifyOTPUsecase {

    constructor(
        @inject("IOtpService") private otpService : IOtpService
    ){}


    async execute({ email, otp }: { email: string; otp: string; }): Promise<void> {
        const isValidOtp  = await this.otpService.verifyOtp({email , otp}) as resultOtpVerify
        console.log(isValidOtp);

        if(!isValidOtp.success) {
            throw new CustomError(isValidOtp.message,HTTP_STATUS.UNAUTHORIZED)
        }
    }
}