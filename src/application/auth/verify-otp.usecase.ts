import { inject, injectable } from "tsyringe";
import { IVerifyOtpUsecase } from "../../domain/interfaces/usecase/auth-usecase.interfaces";
import { VerifyOtpInput } from "../../domain/interfaces/usecase/types/auth.types";
import { IOtpService } from "../../domain/interfaces/service/otp-service.interface";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { HTTP_STATUS } from "../../shared/constants/constants";

@injectable()
export class VerifyOtpUsecase implements IVerifyOtpUsecase {
    constructor(
        @inject('IOtpService') private _otpService : IOtpService
    ){}
    async verifyOtp(input: VerifyOtpInput): Promise<void> {
        const isValidOtp = await this._otpService.verifyOtp(input.email,input.otp)
        if(!isValidOtp.success) {
            throw new CustomError(isValidOtp.message, HTTP_STATUS.BAD_REQUEST)
        }
    }
}