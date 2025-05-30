import { TRole } from "../../shared/constants/constants";

export interface SendOtpEmailInput {
    email : string;
    userRole : TRole;
}
export interface RegisterUserInput {
    name : string;
    email : string;
    role : TRole;
    password : string;
    googleId ?: string;
}

export interface VerifyOtpInput {
    email : string;
    otp : string;
}


export interface VerifyOtpResultOutput {
    success : boolean;
    message : string
}