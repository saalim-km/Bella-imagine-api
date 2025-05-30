import { inject, injectable } from "tsyringe";
import { ISendAuthEmailUsecase } from "../../domain/interfaces/usecase/auth-usecase.interfaces";
import { IEmailService } from "../../domain/interfaces/service/email-service.interface";
import { IEmailExistenceUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { ERROR_MESSAGES, HTTP_STATUS, TRole, VERIFICATION_MAIL_CONTENT } from "../../shared/constants/constants";
import { CustomError } from "../../shared/utils/custom-error";
import { IOtpService } from "../../domain/interfaces/service/otp-service.interface";
import { SendOtpEmailInput } from "./auth.types";

@injectable()
export class SendAuthOtpEmailUsecase implements ISendAuthEmailUsecase {
    constructor(
        @inject('IEmailService') private _emailService : IEmailService,
        @inject('IEmailExistenceUsecase') private _emailExistenceCheck : IEmailExistenceUsecase,
        @inject('IOtpService') private _otpService : IOtpService,
    ){}
    async sendAuthEmail(input : SendOtpEmailInput): Promise<void> {
        const isEmailExists = await this._emailExistenceCheck.doesEmailExist(input.email,input.userRole)
        if(isEmailExists){
            throw new CustomError(ERROR_MESSAGES.EMAIL_EXISTS,HTTP_STATUS.CONFLICT)
        }

        const newOtp = await this._otpService.generateOtp()
        console.log(`--------------------otp ${newOtp}-----------------------`);
        await this._otpService.storeOtp(newOtp, input.email)
        await this._emailService.send(input.email,"BELLA IMAGINE - Verify Your Email",VERIFICATION_MAIL_CONTENT(newOtp))
    }
}   