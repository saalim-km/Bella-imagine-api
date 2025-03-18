import { ObjectId,Document, model } from "mongoose";
import { INotificationEntity } from "../../../entities/models/notification.entity";
import { notificationSchema } from "../schemas/notification.schema";

export interface INotificationModel extends Omit<INotificationEntity , '_id'>, Document {
    _id : ObjectId
}

export const NotificationModel = model<INotificationModel>("Notification",notificationSchema)