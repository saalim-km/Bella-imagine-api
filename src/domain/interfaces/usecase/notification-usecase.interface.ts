import { Types } from "mongoose";
import { INotification } from "../../models/notification";
import { CreateNotificationInput, GetAllNotificationsInput, NotificationPaginatedResponse } from "./types/notification.types";
import { PaginatedResponse } from "./types/common.types";

export interface INotificationUsecase {
    createNotification(input : CreateNotificationInput) : Promise<INotification>
    readAllNotifications(userId : Types.ObjectId): Promise<void>
    getAllNotifications(input : GetAllNotificationsInput) : Promise<NotificationPaginatedResponse> 
    clearNotifications(receiverId : Types.ObjectId) : Promise<void> 
}