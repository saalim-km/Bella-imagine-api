import {  CreateConversationDTO, IConversationEntity, UpdateConversationDTO } from "../../../entities/models/conversation.entity";
import { IConversationRepository } from "../../../entities/repositoryInterfaces/chat/conversation-repository";
import { ConversationModel } from "../../../frameworks/database/models/conversation.model";

export class ConversationRepository implements IConversationRepository {
    async create(dto: CreateConversationDTO): Promise<IConversationEntity> {
        return await ConversationModel.create(dto);
    }
  
    async findById(id: string): Promise<IConversationEntity | null> {
      return ConversationModel.findById(id).lean();
    }
  
    async findByBookingId(bookingId: string): Promise<IConversationEntity | null> {
      return ConversationModel.findOne({ bookingId }).lean();
    }
  
    async findUserConversations(userId: string): Promise<IConversationEntity[] | null> {
        return await ConversationModel.find({
          $or: [{ clientId: userId }, { vendorId: userId }],
        })
          .populate({path : "clientId" , select : "name email isOnline lastSeen"})
          .populate({path : "vendorId" , select : "name email isOnline lastSeen"})
          .populate({path : "lastMessage" , select : "text senderId"})
          .lean();
      }
  
    async update(id: string, dto: UpdateConversationDTO): Promise<IConversationEntity | null> {
      return ConversationModel.findByIdAndUpdate(id, dto, { new: true }).lean();
    }
  }