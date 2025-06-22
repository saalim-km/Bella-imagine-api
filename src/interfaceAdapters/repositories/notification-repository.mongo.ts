import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { INotification } from "../../domain/models/notification";
import { INotificationRepository } from "../../domain/interfaces/repository/notification.repository";
import { Notification } from "../database/schemas/notification.schema";
import { Types } from "mongoose";

@injectable()
export class NotificationRepository extends BaseRepository<INotification> implements INotificationRepository {
    constructor(){
        super(Notification)
    }

    async readAllNotifications(userId: Types.ObjectId): Promise<void> {
        await this.model.updateMany({receiverId : userId , isRead : {$neq : true}} , {$set : {isRead : true}})
    }
}