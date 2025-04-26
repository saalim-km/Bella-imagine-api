import { inject, injectable } from "tsyringe";
import { IGetConversationsUsecase } from "../../entities/usecaseInterfaces/chat/get-conversations-usecase.interface";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import IConversationRepository from "../../entities/repositoryInterfaces/chat/conversation-repository.interface";
import { IConversationEntity } from "../../entities/models/conversation.entity";
import { TRole } from "../../shared/constants";

@injectable()
export class GetConversationUsecase implements IGetConversationsUsecase {
    constructor(
        @inject('IBookingRepository') private bookingRepository : IBookingRepository,
        @inject('IConversationRepository') private conversationRepository : IConversationRepository,
    ){}

    async execute(userId: string , userType: TRole): Promise<IConversationEntity[]> {
        console.log();
        const conversations =  await this.conversationRepository.getConversationsByUserId(userId,userType)
        console.log('got the conversations',conversations);
        return conversations;
    }
}