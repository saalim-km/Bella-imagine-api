import { inject, injectable } from "tsyringe";
import { IForgotPassWordSendOtpUsecase } from "../../entities/usecaseInterfaces/auth/forgot-password-send-otp-usecase.interfac";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { ERROR_MESSAGES, HTTP_STATUS, RESET_PASSWORD_MAIL_CONTENT, TRole } from "../../shared/constants";
import { IEmailService } from "../../entities/services/email-service.interface";
import { IOtpService } from "../../entities/services/otp-service.interface";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { CustomError } from "../../entities/utils/custom-error";

@injectable()
export class ForgotPasswordSendOtp implements IForgotPassWordSendOtpUsecase {
    constructor(
        @inject("IClientRepository") private clientRepository : IClientRepository,
        @inject("IVendorRepository") private vendorRepository : IVendorRepository,
        @inject("IEmailService") private emailService : IEmailService,
        @inject("IOtpService") private otpService : IOtpService,
        @inject("OtpBcrypt") private otpBcrypt : IBcrypt,
    ) {}

    async execute(email: string, userType: TRole): Promise<void> {
        console.log('---------------------------------ForgotPasswordSendOtp---------------------------');
        const otp = await this.otpService.generateOtp()
        const hashedOtp = await this.otpBcrypt.hash(otp);
        console.log(`--------------otp : ${otp}-----------------`);
        
        if(userType === "vendor") {
            console.log('usertype is vendor');
            const isValidUser = await this.vendorRepository.findByEmail(email)

            if(!isValidUser) {
                throw new CustomError("No account found with this email. Please sign up to continue",HTTP_STATUS.UNAUTHORIZED)
            }

            await this.emailService.sendEmail(email,'Reset Password Otp',otp)
            this.otpService.storeOtp(email,hashedOtp);
        }else if(userType === 'client') {
            console.log('usertype is client');
            const isValidUser = await this.clientRepository.findByEmail(email)

            if(!isValidUser) {
                throw new CustomError("No account found with this email. Please sign up to continue",HTTP_STATUS.UNAUTHORIZED)
            }

            await this.emailService.sendEmail(email,'Reset Password ',RESET_PASSWORD_MAIL_CONTENT(otp))
            this.otpService.storeOtp(email,hashedOtp);
        }else{
            throw new CustomError('Wrong user type',HTTP_STATUS.UNAUTHORIZED)
        }

    }
}