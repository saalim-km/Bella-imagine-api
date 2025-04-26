import { injectable } from "tsyringe";
import IConversationRepository from "../../../entities/repositoryInterfaces/chat/conversation-repository.interface";
import { IBookingEntity } from "../../../entities/models/booking.entity";
import { IConversationEntity } from "../../../entities/models/conversation.entity";
import { ConversationModel } from "../../../frameworks/database/models/conversation.model";
import { TRole } from "../../../shared/constants";

@injectable()
export class ConversationRepository implements IConversationRepository {
    async createConversation(conversation: IConversationEntity): Promise<IConversationEntity> {
        return await ConversationModel.create(conversation)
    }

    async getConversationByBooking(bookingId: string): Promise<IConversationEntity | null> {
        return await ConversationModel.findOne({bookingId : bookingId})
    }

    async getConversationsByUserId(userId: string , userType : TRole): Promise<IConversationEntity[]> {
        console.log('in repsoitory ✅✅✅');
        console.log(`userid : ${userId} , usertype : ${userType}`);
        if(userType === 'client'){
            return await ConversationModel.find({
                client : userId
            }).lean()
        }else {
            return await ConversationModel.find({
                vendor : userId
            }).lean()
        }
    }

    async updateConversation(conversationId : string , conversation: IConversationEntity): Promise<void> {
        await ConversationModel.findByIdAndUpdate(conversationId,conversation)
    }

    async getConversationById(conversationId: string): Promise<IConversationEntity | null> {
        return await ConversationModel.findById(conversationId)
    }

    async incrementUnreadCount(conversationId: string, userType: TRole): Promise<void> {
        const field = userType === "client" ? "clientUnreadCount" : "vendorUnreadCount";
        await ConversationModel.findByIdAndUpdate(conversationId,{
            $inc : {[field] : 1}
        })
    }
}