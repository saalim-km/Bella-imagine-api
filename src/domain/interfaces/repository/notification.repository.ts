import { Types } from "mongoose";
import { INotification } from "../../models/notification";
import { IBaseRepository } from "./base.repository";

export interface INotificationRepository extends IBaseRepository<INotification> {
    readAllNotifications(userId : Types.ObjectId) : Promise<void>
    deleteAllNotifications(receiverId:  Types.ObjectId) : Promise<void>
}