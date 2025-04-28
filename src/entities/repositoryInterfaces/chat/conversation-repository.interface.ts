import { TRole } from "../../../shared/constants";
import { IConversationEntity } from "../../models/conversation.entity";


export default interface IConversationRepository {
  getConversationsByUserId(userId: string , userType : TRole): Promise<IConversationEntity[]>;
  createConversation(conversation: IConversationEntity): Promise<IConversationEntity>;
  getConversationByBooking(bookingId: string): Promise<IConversationEntity | null>;
  updateConversation(conversationId : string , conversation: IConversationEntity): Promise<void>;
  getConversationById(conversationId: string) : Promise<IConversationEntity | null>
  incrementUnreadCount(conversationId : string , userType : TRole) : Promise<void>
}