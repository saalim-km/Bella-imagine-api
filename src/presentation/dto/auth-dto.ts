import { TRole } from "../../shared/constants/constants";

export interface SendOtpEmailInputDto {
    email : string;
    role : TRole
}

export interface vendorRegisterDto {
    name : string;
    email : string;
    role : 'vendor';
    password : string;
}
export interface clientRegisterDto {
    name : string;
    email : string;
    role : 'client';
    password : string;
}

export type RegisterInputDto = vendorRegisterDto | clientRegisterDto