import { inject, injectable } from "tsyringe";
import { INotificationUsecase } from "../../entities/usecaseInterfaces/notification/notification-usecase.interface";
import { INotificationEntity } from "../../entities/models/notification.entity";
import { INotificationRepository } from "../../entities/repositoryInterfaces/common/notification-repository.interface";

@injectable()
export class NotificationUsecase implements INotificationUsecase {
    constructor(
        @inject('INotificationRepository') private notificationRepository: INotificationRepository
    ){}
  async sendNotification(dto: INotificationEntity): Promise<INotificationEntity> {
    return await this.notificationRepository.save(dto)
  }
}