import { inject, injectable } from "tsyringe";
import crypto from 'crypto';
import { IOtpService } from "../../domain/interfaces/service/otp-service.interface";
import { IRedisService } from "../../domain/interfaces/service/redis-service.interface";
import { IBcryptService } from "../../domain/interfaces/service/bcrypt-service.interface";

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

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        const key = this.getRedisKey(email);
        const storedHashedOtp = await this.redisService.get(key);
        if (!storedHashedOtp) return false;

        const hashedInputOtp = await this._bcryptService.hash(otp);
        const isMatch = await this._bcryptService.compare(otp, storedHashedOtp)

        if (isMatch) {
            await this.redisService.delete(key); // Invalidate OTP after successful verification
        }

        return isMatch;
    }
}
