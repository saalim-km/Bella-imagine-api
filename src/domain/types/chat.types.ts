import { Types } from "mongoose";
import { TRole } from "../../shared/constants/constants";

export interface IncrementUnreadCount {
    role : TRole;
    conversationId : Types.ObjectId
}