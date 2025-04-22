import { inject, injectable } from "tsyringe";
import { IConversationUsecase } from "../../entities/usecaseInterfaces/chat/conversation-usecase.interface";
import { IConversationRepository } from "../../entities/repositoryInterfaces/chat/conversation-repository";
import { CreateConversationDTO, IConversationEntity } from "../../entities/models/conversation.entity";

@injectable()
export class ConversationUsecase implements IConversationUsecase {
    constructor(
        @inject("IConversationRepository") private converstionRepository : IConversationRepository
    ){}

    async createConversationUsecase(dto: CreateConversationDTO): Promise<IConversationEntity> {
        return await this.converstionRepository.create(dto)
    }
}