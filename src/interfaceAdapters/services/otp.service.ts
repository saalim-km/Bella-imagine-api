import { inject, injectable } from "tsyringe";
import { IOtpService } from "../../entities/services/otp-service.interface";
import crypto from 'crypto'
import { IOTPRepository } from "../../entities/repositoryInterfaces/auth/otp-repository.interface";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";

@injectable()
export class OtpService implements IOtpService {
    constructor(
        @inject("IOTPRepository") private otpRepository : IOTPRepository,
        @inject("IBcrypt") private otpBcrypt : IBcrypt
    ) {}

    generateOtp(): string {
        return (crypto.randomInt(100000, 999999)).toString();
    }

    async storeOtp(email: string, otp: string): Promise<void> {
        const expiresAt = new Date(Date.now() + 1 * 60 * 1000);
        await this.otpRepository.saveOTP(email, otp , expiresAt);
    }

    async verifyOtp({ email, otp }: { email: string, otp: string }): Promise<boolean> {
        const otpEntry = await this.otpRepository.findOTP({email});

        if(!otpEntry) {
            return false;
        }

        if(
            new Date() > otpEntry.expiresAt ||
            ! (await this.otpBcrypt.compare(otp , otpEntry.otp))
        ) {
            console.log("in otp verify ==>");
            await this.otpRepository.deleteOTP(email , otp);
            return false;
        }
        await this.otpRepository.deleteOTP(email , otp);
        return true;
    }

}