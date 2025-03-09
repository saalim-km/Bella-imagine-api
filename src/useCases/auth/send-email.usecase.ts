import { inject, injectable } from "tsyringe";
import { ISendEmailUseCase } from "../../entities/usecaseIntefaces/auth/send-email-usecase.interface";
import { IEmailService } from "../../entities/services/email-service.interface";
import { IEmailExistenceService } from "../../entities/services/email-existence-service.interface";
import { CustomError } from "../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { IOtpService } from "../../entities/services/otp-service.interface";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";

@injectable()
export class SendEmailUseCase implements ISendEmailUseCase {
    constructor(
        @inject("IEmailService") private emailService : IEmailService,
        @inject("IEmailExistenceService") private emailexistService : IEmailExistenceService,
        @inject("IOtpService") private otpService : IOtpService, 
        @inject("IBcrypt") private otpBcrypt : IBcrypt
    ){}

    async execute(email: string): Promise<void> {
        const emailExists = await this.emailexistService.emailExist(email);

        if(emailExists) {
            throw new CustomError(ERROR_MESSAGES.EMAIL_EXISTS , HTTP_STATUS.CONFLICT);
        }

        const otp = await this.otpService.generateOtp();
        console.log(`-----------otp : ${otp}-----------------`);
        const hashedOtp = await this.otpBcrypt.hash(otp);
        await this.otpService.storeOtp(email , hashedOtp);
        await this.emailService.sendEmail(
            email,
            "BELLA IMAGINE - Verify Your Email",
            otp
        );
    }
}