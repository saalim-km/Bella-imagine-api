import { inject, injectable } from "tsyringe";
import { ISendMessageUsecase, SendMessageDTO } from "../../entities/usecaseInterfaces/chat/send-message-usecase.interface";
import IMessageRepository from "../../entities/repositoryInterfaces/chat/message-repository.interface";
import { IMessageEntity } from "../../entities/models/message.entity";
import IConversationRepository from "../../entities/repositoryInterfaces/chat/conversation-repository.interface";
import { CustomError } from "../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../shared/constants";

@injectable()
export class SendMessageUsecase implements ISendMessageUsecase {
    constructor(
        @inject('IMessageRepository') private messageRepository : IMessageRepository,
        @inject('IConversationRepository') private conversationRepository : IConversationRepository
    ){}

    async execute(dto: SendMessageDTO): Promise<void> {
        const message : IMessageEntity = {
            conversationId : dto.conversationId,
            senderId : dto.senderId,
            text : dto.text,
            type : dto.type,
            timestamp : new Date(),
            isDeleted : false
        }


        const conversation = await this.conversationRepository.getConversationById(dto.conversationId)

        if(!conversation) {
            throw new CustomError('no conversation found',HTTP_STATUS.NOT_FOUND)
        }

        conversation.lastMessage = message;
        await Promise.all([
            this.messageRepository.saveMessage(message),
            this.conversationRepository.updateConversation(dto.conversationId,conversation),
            this.conversationRepository.incrementUnreadCount(dto.conversationId,dto.userType)
        ])
    }
}