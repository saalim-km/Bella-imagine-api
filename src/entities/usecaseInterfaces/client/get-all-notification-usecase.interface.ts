import { INotificationEntity } from "../../models/notification.entity";

export interface IGetAllClientNotificationUsecase {
    execute(receiverId : string) : Promise<INotificationEntity[]>
}