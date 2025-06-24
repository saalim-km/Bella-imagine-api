import { inject, injectable } from "tsyringe";
import { INotificationUsecase } from "../../domain/interfaces/usecase/notification-usecase.interface";
import { CreateNotificationInput, GetAllNotificationsInput, NotificationPaginatedResponse } from "../../domain/interfaces/usecase/types/notification.types";
import { INotification } from "../../domain/models/notification";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";
import { INotificationRepository } from "../../domain/interfaces/repository/notification.repository";
import { FilterQuery, Types } from "mongoose";

@injectable()
export class NotifiactionUsecase implements INotificationUsecase {
    constructor(
        @inject('INotificationRepository') private _notificationRepo : INotificationRepository
    ){}

    async createNotification(input: CreateNotificationInput): Promise<INotification> {
        const {message,receiverId,receiverModel,senderId,senderModel,type}= input;

        if(!message || !receiverId || !receiverModel || !senderId || !senderModel) {
            throw new CustomError(ERROR_MESSAGES.ENOUGH_DATA_TO_CREATE_NOTIFICATION , HTTP_STATUS.BAD_REQUEST)
        }

        return await this._notificationRepo.create({
            message: message,
            receiverId : receiverId,
            senderId : senderId,
            receiverModel : receiverModel,
            senderModel : senderModel,
            type : type
        })
    }

    async readAllNotifications(userId: Types.ObjectId): Promise<void> {
        await this._notificationRepo.readAllNotifications(userId)
    }

    async getAllNotifications(input: GetAllNotificationsInput): Promise<NotificationPaginatedResponse> {
        const {limit,page,userId} = input;
        const skip = 0; // dont skip for scrolling pagination 
        const filter : FilterQuery<INotification> = {receiverId : userId}

        const [notifications,count,unReadCount] = await Promise.all([
            this._notificationRepo.findAll(filter,skip,limit,-1),
            this._notificationRepo.count(filter),
            this._notificationRepo.count({...filter,isRead : false})
        ])

        return {
            data : notifications,
            total : count,
            unReadTotal : unReadCount
        }
    }

    async clearNotifications(receiverId: Types.ObjectId): Promise<void> {
        await this._notificationRepo.deleteAllNotifications(receiverId)
    }
    
}