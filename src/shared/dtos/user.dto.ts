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
    availableSlots ?: [];
    notifications ?: [];
    services ?: [];
}

export type userDTO =  ClientDTO | VendorDTO;