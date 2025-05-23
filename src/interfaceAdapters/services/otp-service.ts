import { inject, injectable } from "tsyringe";
import crypto from 'crypto'
import { IOtpService } from "../../domain/interfaces/service/otp-service.interface";
import { IRedisService } from "../../domain/interfaces/service/redis-service.interface";

@injectable()
export class OtpService implements IOtpService {
    constructor(
        @inject('IRedisService') private redisService : IRedisService
    ){}
    generateOtp(): string {
        return (crypto.randomInt(100000, 999999)).toString();
    }

    async storeOtp(otp: number,email : string): Promise<void> {
        const key = `otp-${email}`
        await this.redisService.set(key, otp.toString(),60)
    }

    async verifyOtp(email : string , otp : number): Promise<boolean> {
        const key = `otp-${email}`
        const isOtpExist = await this.redisService.get(key);
        return !!isOtpExist;
    }
}