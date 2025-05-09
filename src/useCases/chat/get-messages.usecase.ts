import { inject, injectable } from "tsyringe";
import IMessageRepository from "../../entities/repositoryInterfaces/chat/message-repository.interface";
import { IMessageEntity } from "../../entities/models/message.entity";
import { IGetMessageUsecase } from "../../entities/usecaseInterfaces/chat/get-messages-usecase.interface";
import { IAwsS3Service } from "../../entities/services/awsS3-service.interface";
import { s3UrlCache } from "../../frameworks/di/resolver";

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
          let mediaUrl = await s3UrlCache.getCachedSignUrl(message.mediaKey);

          // Assign mediaUrl to mediaKey (optional: use a separate field if needed)
          message.mediaKey = mediaUrl;
        }

        return message;
      })
    );

    return enrichedMessages;
  }
}
