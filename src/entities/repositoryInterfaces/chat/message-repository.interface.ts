import { IConversationEntity } from "../../models/conversation.entity";
import { IMessageEntity } from "../../models/message.entity";


export default interface IMessageRepository {
  saveMessage(message: IMessageEntity): Promise<void>;
  getMessagesByConversationId(conversationId: string): Promise<IMessageEntity[]>;
  updateMessage(messageId : string , message: IMessageEntity): Promise<void>;
  deleteMessage(messageId: string): Promise<void>;
  addReaction(messageId: string, reaction: IMessageEntity): Promise<void>;
  removeReaction(messageId: string, reaction: string): Promise<void>;
  markAsReadMessage(messageId : string) : Promise<void>
}
