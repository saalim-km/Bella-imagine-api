import { Types } from "mongoose";
import { INotification, TNotificationType } from "../../../models/notification";
import { PaginationInput } from "./admin.types";

export interface CreateNotificationInput {
    message : string;
    receiverId : Types.ObjectId;
    receiverModel : 'Client' | 'Vendor' ;
    senderId : Types.ObjectId;
    senderModel : 'Client' | 'Vendor' ;
    type : TNotificationType
}

export interface GetAllNotificationsInput extends Omit<PaginationInput, 'search' | 'createdAt'> {
    userId : Types.ObjectId
}

export interface NotificationPaginatedResponse {
  data : INotification[];
  total : number;
  unReadTotal : number
}