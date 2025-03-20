import { ObjectId } from "mongoose";

export interface INotificationEntity {
    _id ?: ObjectId
    message : string;
    receiverId : string;
    isRead ?: boolean
}