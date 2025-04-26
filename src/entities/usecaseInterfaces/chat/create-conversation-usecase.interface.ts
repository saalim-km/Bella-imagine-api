import { IConversationEntity } from "../../models/conversation.entity";

export interface ICreateConversationUseCase {
    execute(clientId : string , vendorId : string , bookingId : string) : Promise<IConversationEntity>
}