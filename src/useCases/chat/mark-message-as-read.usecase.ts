import { inject, injectable } from "tsyringe";
import { IMarkMessageAsReadUsecase } from "../../entities/usecaseInterfaces/chat/mark-message-as-read-usecase.interface";
import IMessageRepository from "../../entities/repositoryInterfaces/chat/message-repository.interface";

@injectable()
export class MarkMessageAsReadUsecase implements IMarkMessageAsReadUsecase {
    constructor(
        @inject('IMessageRepository') private messageRepository : IMessageRepository
    ){}

    async execute(messageId: string): Promise<void> {
        await this.messageRepository.markAsReadMessage(messageId)
    }
}