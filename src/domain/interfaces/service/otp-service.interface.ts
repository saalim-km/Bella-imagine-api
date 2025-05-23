export interface IOtpService {
    generateOtp(): string;
    verifyOtp(email : string , otp : number): Promise<boolean>;
    storeOtp(otp : number , email : string) : Promise<void>
}