import { TRole, TStatus } from "../constants";

export interface ClientDTO {
    name : string;
    email : string;
    password : string;
    role : 'client';
}

export interface VendorDTO {
    name : string;
    email : string;
    phoneNumber ?: number;
    password : string;
    location ?: string;
    languages ?: string[];
    role : 'vendor';
    profileImage ?: string;
    description ?: string;
    categories ?: [];
    status ?: TStatus[];
}


export type userDTO =  ClientDTO | VendorDTO;


export interface LoginUserDto {
    email : string,
    password ?: string,
    role : TRole
}


export interface UpdateClientDto {
    name ?: string;
    email ?: string;
    phoneNumber ?: number;
    location ?: string;
    profileImage?:  string; 
}

export interface UpdateVendorDto {
    name ?: string;
    phoneNumber ?: number;
    location ?: string;
    languages ?: string[];
    portfolioWebsite ?: string;
    profileDescription ?: string;
    profileImage?: string; 
    verificationDocument ?: string;
}
