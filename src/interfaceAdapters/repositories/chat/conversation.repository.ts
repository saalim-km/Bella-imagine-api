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

    async getConversationsByUserId(userId: string): Promise<IConversationEntity[]> {
        return await ConversationModel.find({
            "participants._id" : userId
        }).lean()
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