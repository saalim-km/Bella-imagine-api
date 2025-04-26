import { inject, injectable } from "tsyringe";
import { ICreateConversationUseCase } from "../../entities/usecaseInterfaces/chat/create-conversation-usecase.interface";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import IConversationRepository from "../../entities/repositoryInterfaces/chat/conversation-repository.interface";
import { IConversationEntity } from "../../entities/models/conversation.entity";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { CustomError } from "../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { IUserEntityForChat } from "../../entities/models/iuser.entity";

@injectable()
export class CreateConversationUseCase implements ICreateConversationUseCase {
    constructor(
        @inject('IBookingRepository') private bookingRepository: IBookingRepository,
        @inject("IConversationRepository") private conversationRepository : IConversationRepository,
        @inject('IClientRepository') private clientRepository : IClientRepository,
        @inject('IVendorRepository') private vendorRepository : IVendorRepository
    ){}

    async execute(clientId: string, vendorId: string , bookingId : string): Promise<IConversationEntity> {
        try {
            const [client , vendor] = await Promise.all([
                this.clientRepository.findById(clientId),
                this.vendorRepository.findById(vendorId)
            ])
    
            if(!client || !vendor) {
                throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND,HTTP_STATUS.BAD_REQUEST);
            }
    
            const booking = await this.bookingRepository.findById(bookingId);
    
            if(!booking) {
                throw new CustomError('no booking found ',HTTP_STATUS.BAD_REQUEST)
            }
    
            const clientParticipant : Partial<IUserEntityForChat> = {
                _id : client._id?.toString() || '',
                role : 'client',
                name : client.name,
                avatar : client.profileImage,
                isOnline : false,
                lastSeen : new Date().toISOString()
            }
    
            const vendorParticipant : Partial<IUserEntityForChat> = {
                _id : vendor._id?.toString(),
                role:'vendor',
                name : vendor.name,
                avatar : vendor.profileImage,
                isOnline : false,
                lastSeen : new Date().toISOString()
            }
            
            console.log(clientParticipant);
            console.log(vendorParticipant);
            const newConvo: IConversationEntity  = {
                bookingId : booking._id!,
                client : clientParticipant,
                vendor : vendorParticipant
            }

            return await this.conversationRepository.createConversation(newConvo)
        } catch (error) {
            console.log(error);
            throw error; // Re-throw the error to ensure the function does not return undefined
        }
    }
}