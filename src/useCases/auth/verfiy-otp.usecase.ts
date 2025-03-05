import { inject, injectable } from "tsyringe";
import { IOtpService } from "../../entities/services/otp-service.interface";
import { IVerifyOTPUsecase } from "../../entities/usecaseIntefaces/auth/verify-otp-usecase.interface.";

@injectable()
export class VerifyOTPUsecase implements IVerifyOTPUsecase {

    constructor(
        @inject("IOtpService") private otpService : IOtpService
    ){}


    async execute({ email, otp }: { email: string; otp: string; }): Promise<void> {
        const isValidOtp = await this.otpService.verifyOtp({email , otp})
    }
}