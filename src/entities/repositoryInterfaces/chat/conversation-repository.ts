import { ConversationWithParticipants, CreateConversationDTO, IConversationEntity, UpdateConversationDTO } from "../../models/conversation.entity";

export interface IConversationRepository {
    create(dto: CreateConversationDTO): Promise<IConversationEntity>;
    findById(id: string): Promise<IConversationEntity | null>;
    findByBookingId(bookingId: string): Promise<IConversationEntity | null>;
    findUserConversations(userId: string): Promise<IConversationEntity[] | null>;
    update(id: string, dto: UpdateConversationDTO): Promise<IConversationEntity | null>;
}