import { inject, injectable } from "tsyringe";
import crypto from 'crypto';
import { IOtpService } from "../../domain/interfaces/service/otp-service.interface";
import { IRedisService } from "../../domain/interfaces/service/redis-service.interface";
import { IBcryptService } from "../../domain/interfaces/service/bcrypt-service.interface";
import { VerifyOtpResultOutput } from "../../domain/interfaces/usecase/types/auth.types";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../shared/constants/constants";

@injectable()
export class OtpService implements IOtpService {
    constructor(
        @inject('IRedisService') private redisService: IRedisService,
        @inject('IBcryptService') private _bcryptService : IBcryptService
    ) {}

    generateOtp(): string {
        return crypto.randomInt(100000, 999999).toString();
    }

    private getRedisKey(email: string): string {
        return `otp-${email}`;
    }

    async storeOtp(otp: string, email: string): Promise<void> {
        const newOtp = this.generateOtp()
        const hashedOtp = await this._bcryptService.hash(otp);
        const key = this.getRedisKey(email);
        await this.redisService.set(key, hashedOtp, 60);
    }

    async verifyOtp(email: string, otp: string): Promise<VerifyOtpResultOutput> {
        const key = this.getRedisKey(email);
        const storedHashedOtp = await this.redisService.get(key);
        if (!storedHashedOtp) {
            return {
                success: false,
                message: ERROR_MESSAGES.OTP_EXPIRED
            }
        }

        const isMatch = await this._bcryptService.compare(otp, storedHashedOtp)

        if(!isMatch){
            return {
                success: false,
                message: ERROR_MESSAGES.INVALID_OTP
            }
        }

        return {
            success : true,
            message : SUCCESS_MESSAGES.OTP_VERIFY_SUCCESS
        }
    }
}
