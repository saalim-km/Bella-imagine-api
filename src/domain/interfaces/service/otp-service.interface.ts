export interface IOtpService {
    generateOtp(): string;
    verifyOtp(email: string, otp: string): Promise<boolean>;
    storeOtp(otp: string, email: string) : Promise<void>
}