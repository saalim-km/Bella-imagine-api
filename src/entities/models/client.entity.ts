import { ObjectId } from "mongoose";
import { TRole } from "../../shared/constants";

export interface IClientEntity {
    _id ?: ObjectId;
    name : string;
    email : string;
    profileImage ?: string;
    password ?: string;
    phoneNumber ?: number;
    location ?: string;
    googleId ?: string;
    role : TRole;
    savedPhotographers ?: ObjectId[];
    savedPhotos ?: ObjectId[];
    onlineStatus : "offline" | "online";
    lastStatusUpdated : Date
    isActive ?: boolean;
    isblocked ?: boolean;
    createdAt ?: Date;
    updatedAt ?: Date;
}