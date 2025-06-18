import { inject, injectable } from "tsyringe";
import { IEmailExistenceUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { IUser } from "../../domain/models/user-base";
import { SendOtpEmailInput } from "../../domain/interfaces/usecase/types/auth.types";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS, RESET_PASSWORD_MAIL_CONTENT } from "../../shared/constants/constants";
import { IOtpService } from "../../domain/interfaces/service/otp-service.interface";
import { IEmailService } from "../../domain/interfaces/service/email-service.interface";
import { IForgotPasswordUsecase } from "../../domain/interfaces/usecase/auth-usecase.interfaces";

@injectable()
export class ForgotPasswordUsecase implements IForgotPasswordUsecase {
    constructor(
        @inject('IEmailExistenceUsecase') private _emailExist : IEmailExistenceUsecase<IUser>,
        @inject('IOtpService') private _otpService : IOtpService,
        @inject('IEmailService') private _emailService : IEmailService,
    ){}

    async forgotPassword(input: SendOtpEmailInput): Promise<void> {
        const {email , role} = input;
        const userExists = await this._emailExist.doesEmailExist(email , role);

        if(!userExists.success){
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND , HTTP_STATUS.BAD_REQUEST)
        }

        const newOtp = await this._otpService.generateOtp()
        console.log(`----------------------------Otp for reset-password : ${newOtp}-----------------------------------`);
        await this._otpService.storeOtp(newOtp,email);
        await this._emailService.send(email,'Your Bella Imagine Password Reset Code',RESET_PASSWORD_MAIL_CONTENT(newOtp))
    }
}