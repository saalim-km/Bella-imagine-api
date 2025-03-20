import { injectable } from "tsyringe";
import { INotificationRepository } from "../../../entities/repositoryInterfaces/common/notification-repository.interface";
import { NotificationModel } from "../../../frameworks/database/models/notification.model";
import { INotificationEntity } from "../../../entities/models/notification.entity";

@injectable()
export class NotificationRepository implements INotificationRepository {
    async save(data : INotificationEntity): Promise<void> {
        await NotificationModel.create(data)
    }
    async find(): Promise<INotificationEntity[]> {
        return await NotificationModel.find()
    }
    async findByReceiverId(receiverId: string): Promise<INotificationEntity[]> {
        return await NotificationModel.find({receiverId : receiverId})
    }
    async updateNotification(id: string, data: Partial<INotificationEntity>): Promise<void> {
        await NotificationModel.findByIdAndUpdate(id,data)
    }
    async deleteNotification(id: string): Promise<void> {
        await NotificationModel.findByIdAndDelete(id);
    }
}