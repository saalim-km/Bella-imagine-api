import { VerifyOtpResultOutput } from "../../../application/auth/auth.types";

export interface IOtpService {
    generateOtp(): string;
    verifyOtp(email: string, otp: string): Promise<VerifyOtpResultOutput>;
    storeOtp(otp: string, email: string) : Promise<void>
}