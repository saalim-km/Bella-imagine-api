import { injectable } from "tsyringe";
import IMessageRepository from "../../../entities/repositoryInterfaces/chat/message-repository.interface";
import { IMessageEntity } from "../../../entities/models/message.entity";
import { MessageModel } from "../../../frameworks/database/models/message.model";
import { IConversationEntity } from "../../../entities/models/conversation.entity";

@injectable()
export class MessageRepository implements IMessageRepository {
  async saveMessage(message: IMessageEntity): Promise<IMessageEntity> {
    return await MessageModel.create(message)
  }

  async getMessagesByConversationId(conversationId: string): Promise<IMessageEntity[]> {
    return await MessageModel.find({conversationId: conversationId})
  }

  async updateMessage(messageId : string , message: IMessageEntity): Promise<void> {
    await MessageModel.findByIdAndUpdate(messageId , message)
  }

  async deleteMessage(messageId: string): Promise<void> {
    await MessageModel.findByIdAndDelete(messageId)
  }

  async addReaction(messageId: string, reaction: IMessageEntity): Promise<void> {
    await MessageModel.findByIdAndUpdate(messageId , {$push : {reactions : reaction}})
  }

  async removeReaction(messageId: string, reaction: string): Promise<void> {
    await MessageModel.findByIdAndUpdate(messageId,{$pull : {reactions : reaction}})
  }

  async markAsReadMessage(messageId: string): Promise<void> {
    await MessageModel.findByIdAndUpdate(messageId,{$set : {isRead : true}})
  }
}