import { IMessageEntity } from "../../models/message.entity";

export interface IGetMessageUsecase {
    execute(conversationId : string): Promise<IMessageEntity[]>
}