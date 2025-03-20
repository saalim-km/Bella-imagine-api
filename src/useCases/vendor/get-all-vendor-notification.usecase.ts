import { inject, injectable } from "tsyringe";
import { IGetAllVendorNotificationUsecase } from "../../entities/usecaseInterfaces/vendor/get-all-vendor-notification-usecase.interface";
import { INotificationRepository } from "../../entities/repositoryInterfaces/common/notification-repository.interface";
import { INotificationEntity } from "../../entities/models/notification.entity";

@injectable()
export class GetAllVendorNotificationUsecase implements IGetAllVendorNotificationUsecase {
    constructor(
        @inject("INotificationRepository") private notificationRepository : INotificationRepository
    ){}

    async execute(receiverId : string): Promise<INotificationEntity[]> {
        return await this.notificationRepository.findByReceiverId(receiverId)
    }
}