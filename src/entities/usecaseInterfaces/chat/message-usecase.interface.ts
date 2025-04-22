import { CreateMessageDTO, IMessageEntity, MessageStatus, ReactionDTO } from "../../models/message.entity";

export interface IMessageUsecase {
    sendMessageUsecase(dto : CreateMessageDTO) : Promise<void>
    DeleteMessageUsecase(messageId : string): Promise<void>
    updateMessageStatusUsecase(messageId : string , status : MessageStatus) : Promise<IMessageEntity | null>
    addReactionUsecase(dto : ReactionDTO) : Promise<IMessageEntity | null>
    getMessagesUsecase(conversationId : string , limit : number , skip: number) : Promise<IMessageEntity[]>
}