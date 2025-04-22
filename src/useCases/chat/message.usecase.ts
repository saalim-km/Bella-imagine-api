import { inject, injectable } from "tsyringe";
import { IMessageUsecase } from "../../entities/usecaseInterfaces/chat/message-usecase.interface";
import { IMessageRepository } from "../../entities/repositoryInterfaces/chat/message-repository.interface";
import { CreateMessageDTO, IMessageEntity, MessageStatus, ReactionDTO } from "../../entities/models/message.entity";

@injectable()
export class MessageUsecase implements IMessageUsecase {
    constructor(
        @inject("IMessageRepository") private messageRepository : IMessageRepository
    ){}

    async sendMessageUsecase(dto: CreateMessageDTO): Promise<void> {
        await this.messageRepository.create(dto)
    }

    async DeleteMessageUsecase(messageId: string): Promise<void> {
        await this.messageRepository.delete(messageId)
    }

    async updateMessageStatusUsecase(messageId: string, status: MessageStatus): Promise<IMessageEntity | null> {
        return await this.messageRepository.updateStatus(messageId,status)
    }

    async addReactionUsecase(dto: ReactionDTO): Promise<IMessageEntity | null> {
        return await this.messageRepository.addReaction(dto)
    }
    
    async getMessagesUsecase(conversationId: string, limit: number = 10, skip: number): Promise<IMessageEntity[]> {
        return await this.messageRepository.findByConversationId(conversationId)
    }
}