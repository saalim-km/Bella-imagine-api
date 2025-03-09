import { resultOtpVerify } from "../../useCases/auth/verfiy-otp.usecase";

export interface IOtpService {
    generateOtp() : string;
    storeOtp(email : string , otp : string) : Promise<void>;
    verifyOtp({email , otp} : {email : string , otp : string}) : Promise<resultOtpVerify>
}