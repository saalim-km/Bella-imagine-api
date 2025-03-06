import { ObjectId } from "mongoose";
import { TRole } from "../../shared/constants";

export interface IRefreshTokenEntity {
    _id ?: string;
    token : string;
    user : ObjectId;
    userType : TRole;
    createdAt ?: Date;
    expiresAt ?: Date;
    updatedAt ?: Date;
}