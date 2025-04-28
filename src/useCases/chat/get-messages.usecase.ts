import { inject, injectable } from "tsyringe";
import IMessageRepository from "../../entities/repositoryInterfaces/chat/message-repository.interface";
import { IMessageEntity } from "../../entities/models/message.entity";
import { IGetMessageUsecase } from "../../entities/usecaseInterfaces/chat/get-messages-usecase.interface";

@injectable()
export default class GetMessagesUseCase implements IGetMessageUsecase {
    constructor(
        @inject('IMessageRepository') private messageRepository : IMessageRepository
    ){}
  
    async execute(conversationId: string): Promise<IMessageEntity[]> {
      return this.messageRepository.getMessagesByConversationId(conversationId);
    }
  }