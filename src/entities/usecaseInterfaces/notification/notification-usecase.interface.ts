import { INotificationEntity } from "../../models/notification.entity";

export interface INotificationUsecase {
    sendNotification(dto : INotificationEntity): Promise<INotificationEntity>
}