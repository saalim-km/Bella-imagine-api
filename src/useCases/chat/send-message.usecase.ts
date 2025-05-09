import { inject, injectable } from "tsyringe";
import { ISendMessageUsecase } from "../../entities/usecaseInterfaces/chat/send-message-usecase.interface";
import IMessageRepository from "../../entities/repositoryInterfaces/chat/message-repository.interface";
import { IMessageEntity } from "../../entities/models/message.entity";
import IConversationRepository from "../../entities/repositoryInterfaces/chat/conversation-repository.interface";
import { CustomError } from "../../entities/utils/custom-error";
import { HTTP_STATUS, TRole } from "../../shared/constants";
import { redisClient } from "../../frameworks/redis/redis.client";
import { config } from "../../shared/config";
import { IAwsS3Service } from "../../entities/services/awsS3-service.interface";
import { s3UrlCache } from "../../frameworks/di/resolver";

@injectable()
export class SendMessageUsecase implements ISendMessageUsecase {
    constructor(
        @inject('IMessageRepository') private messageRepository : IMessageRepository,
        @inject('IConversationRepository') private conversationRepository : IConversationRepository,
        @inject('IAwsS3Service') private awsS3Service : IAwsS3Service
    ){}

    async execute(dto: Partial<IMessageEntity>): Promise<IMessageEntity> {
        console.log('in create message usecase----');
        if(!dto || !dto.conversationId || !dto.senderId || !dto.type) {
            throw new CustomError('no such data for creating message',HTTP_STATUS.BAD_REQUEST)
        }
        console.log(dto);
        const message : IMessageEntity = {
            conversationId : dto.conversationId,
            senderId : dto.senderId,
            text : dto.text || '',
            type : dto.type,
            mediaKey : dto.mediaKey || "",
            timestamp : new Date(),
            isDeleted : false
        }


        const conversation = await this.conversationRepository.getConversationById(dto.conversationId as string)

        if(!conversation) {
            throw new CustomError('no conversation found',HTTP_STATUS.NOT_FOUND)
        }

        conversation.lastMessage = message;
        const [newMessage , conversations ] = await Promise.all([
            this.messageRepository.saveMessage(message),
            this.conversationRepository.updateConversation(dto.conversationId as string,conversation),
            this.conversationRepository.incrementUnreadCount(dto.conversationId as string , dto.userType as TRole)
        ])
        
        console.log('got the new messae from repo : ',newMessage);

        if (newMessage.mediaKey) {
            let mediaUrl = await s3UrlCache.getCachedSignUrl(newMessage.mediaKey);
            newMessage.mediaKey = mediaUrl;
        }
        return newMessage
    }
}