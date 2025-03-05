export interface IOtpService {
    generateOtp() : string;
    storeOtp(email : string , otp : string) : Promise<void>;
    verifyOtp({email , otp} : {email : string , otp : string}) : Promise<boolean>
}