import { inject, injectable } from "tsyringe";
import { INotificationEntity } from "../../entities/models/notification.entity";
import { INotificationRepository } from "../../entities/repositoryInterfaces/common/notification-repository.interface";
import { IGetAllClientNotificationUsecase } from "../../entities/usecaseInterfaces/client/get-all-notification-usecase.interface";

@injectable()
export class GetAllClientNotificationUsecase implements IGetAllClientNotificationUsecase {
    constructor(
        @inject("INotificationRepository") private notificationRepository : INotificationRepository
    ){}

    async execute(receiverId : string): Promise<INotificationEntity[]> {
        return await this.notificationRepository.findByReceiverId(receiverId)
    }
}