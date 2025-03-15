import { inject, injectable } from "tsyringe";
import { IOtpService } from "../../entities/services/otp-service.interface";
import crypto from 'crypto'
import { IOTPRepository } from "../../entities/repositoryInterfaces/auth/otp-repository.interface";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { resultOtpVerify } from "../../useCases/auth/verfiy-otp.usecase";
import { SUCCESS_MESSAGES } from "../../shared/constants";
import { OtpBcrypt } from "../../frameworks/security/otp.bcrypt.";

@injectable()
export class OtpService implements IOtpService {
    constructor(
        @inject("IOTPRepository") private otpRepository : IOTPRepository,
        @inject("OtpBcrypt") private otpBcrypt : IBcrypt
    ) {}

    generateOtp(): string {
        return (crypto.randomInt(100000, 999999)).toString();
    }

    async storeOtp(email: string, otp: string): Promise<void> {
        const expiresAt = new Date(Date.now() + 1 * 60 * 1000);
        await this.otpRepository.saveOTP(email, otp , expiresAt);
    }

    async verifyOtp({ email, otp }: { email: string, otp: string }): Promise<resultOtpVerify> {
        const otpEntry = await this.otpRepository.findOTP({email});

        if(!otpEntry) {
            return {success : false , message : 'Invalid Otp'}
        }

        if(! (await this.otpBcrypt.compare(otp , otpEntry.otp))){
            return {success : false , message : 'Invalid Otp'}
        }

        if(
            new Date() > otpEntry.expiresAt
        ) {
            console.log("in otp verify ==>");
            await this.otpRepository.deleteOTP(email , otp);
            return  { success : false , message : 'Otp Expired'}
        }


        await this.otpRepository.deleteOTP(email , otp);
        return {success : true , message : SUCCESS_MESSAGES.VERIFICATION_SUCCESS}
    }

}