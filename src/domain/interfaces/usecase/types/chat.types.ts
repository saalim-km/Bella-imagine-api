import { Types } from "mongoose";
import { TRole } from "../../../../shared/constants/constants";

export interface BaseUserInput {
    userId : Types.ObjectId;
    role : TRole;
}
export interface UpdateOnlineStatusInput extends BaseUserInput {
    status : boolean
}

export interface UpdateLastSeenInput extends BaseUserInput {
    lastSeen : string
}