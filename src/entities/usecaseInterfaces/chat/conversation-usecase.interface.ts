import { CreateConversationDTO, IConversationEntity } from "../../models/conversation.entity";

export interface IConversationUsecase {
    createConversationUsecase(dto : CreateConversationDTO) : Promise<IConversationEntity>
}