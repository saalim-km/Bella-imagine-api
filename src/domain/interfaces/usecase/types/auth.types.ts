import { TRole } from "../../../../shared/constants/constants";

export interface SendOtpEmailInput {
  email: string;
  role: TRole;
}
export interface RegisterUserInput {
  name: string;
  email: string;
  role: TRole;
  password: string;
  googleId?: string;
  profileImage?: string
}

export interface VerifyOtpInput {
  email: string;
  otp: string;
}

export interface VerifyOtpResultOutput {
  success: boolean;
  message: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
  role: TRole;
}

export interface LoginUserOuput {
  _id: string;
  name: string;
  email: string;
  role: TRole;
  avatar: string;
}

export interface ResetPasswordInput {
  email: string;
  password: string;
  role: TRole;
}

export interface GoogleLoginInput {
  credential: any;
  client_id: any;
  role: TRole;
}
