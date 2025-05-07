import { inject, injectable } from "tsyringe";
import IMessageRepository from "../../entities/repositoryInterfaces/chat/message-repository.interface";
import { IMessageEntity } from "../../entities/models/message.entity";
import { IGetMessageUsecase } from "../../entities/usecaseInterfaces/chat/get-messages-usecase.interface";
import { redisClient } from "../../frameworks/redis/redis.client";
import { config } from "../../shared/config";
import { IAwsS3Service } from "../../entities/services/awsS3-service.interface";
import logger from "../../shared/utils/logger.utils";

@injectable()
export default class GetMessagesUseCase implements IGetMessageUsecase {
  constructor(
    @inject('IMessageRepository') private messageRepository: IMessageRepository,
    @inject('IAwsS3Service') private awsS3Service: IAwsS3Service
  ) {}

  async execute(conversationId: string): Promise<IMessageEntity[]> {
    const messages = await this.messageRepository.getMessagesByConversationId(conversationId);

    const enrichedMessages = await Promise.all(
      messages.map(async (message) => {
        if (message.mediaKey) {
          let mediaUrl = await redisClient.get(message.mediaKey);
          if (mediaUrl) {
            logger.info(`Cached media URL found for key: ${message.mediaKey}`);
          } else {
            mediaUrl = await this.awsS3Service.getFileUrlFromAws(
              message.mediaKey,
              config.redis.REDIS_PRESIGNED_URL_EXPIRY
            );
            await redisClient.setEx(
              message.mediaKey,
              config.redis.REDIS_PRESIGNED_URL_EXPIRY,
              mediaUrl
            );
            logger.info(`New media URL generated and cached for key: ${message.mediaKey}`);
          }

          // Assign mediaUrl to mediaKey (optional: use a separate field if needed)
          message.mediaKey = mediaUrl;
        }

        return message;
      })
    );

    return enrichedMessages;
  }
}
