import { INotificationEntity } from "../../models/notification.entity"

export interface INotificationRepository {
    save (data : INotificationEntity) : Promise<INotificationEntity>
    find() : Promise<INotificationEntity[]>
    updateNotification (id : string,data : Partial<INotificationEntity>) : Promise<void>
    deleteNotification (id : string) : Promise<void>
    findByReceiverId(receiverId : string) : Promise<INotificationEntity[]>
}