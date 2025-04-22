import { CreateMessageDTO, IMessageEntity, MessageStatus, ReactionDTO, UpdateMessageDTO } from "../../models/message.entity";

export interface IMessageRepository {
    create(dto: CreateMessageDTO): Promise<void>;
    findById(id: string): Promise<IMessageEntity | null>;
    findByConversationId(conversationId: string, limit?: number, skip?: number): Promise<IMessageEntity[]>;
    update(id: string, dto: UpdateMessageDTO): Promise<IMessageEntity | null>;
    updateStatus(id: string, status: MessageStatus): Promise<IMessageEntity | null>;
    addReaction(dto: ReactionDTO): Promise<IMessageEntity | null>;
    delete(id: string): Promise<IMessageEntity | null>;
}