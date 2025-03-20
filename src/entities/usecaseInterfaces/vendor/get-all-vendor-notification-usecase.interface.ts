import { INotificationEntity } from "../../models/notification.entity";

export interface IGetAllVendorNotificationUsecase {
    execute(receiverId : string) : Promise<INotificationEntity[]>
}