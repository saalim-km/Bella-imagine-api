import { ObjectId } from "mongoose";
import { TRole } from "../../shared/constants";
import { Location } from "../../shared/types/vendor/service.type";

export type TLocation = {
    address: string;
    lat: number;
    lng: number;
}

export interface IClientEntity {
    _id ?: ObjectId | string;
    name : string;
    email : string;
    profileImage ?: string;
    password ?: string;
    phoneNumber ?: number;
    location ?: TLocation;
    googleId ?: string;
    role : TRole;
    savedPhotographers ?: ObjectId[];
    savedPhotos ?: ObjectId[];
    isOnline ?: boolean;
    lastSeen ?: Date
    isActive ?: boolean;
    isblocked ?: boolean;
    createdAt ?: Date;
    updatedAt ?: Date;
}