import { injectable } from "tsyringe";
import { IConversationRepository } from "../../domain/interfaces/repository/conversation.repository";
import { BaseRepository } from "./base-repository.mongo";
import { Conversation } from "../database/schemas/conversation.schema";
import { IConversation } from "../../domain/models/chat";
import { IncrementUnreadCount } from "../../domain/types/chat.types";
import { CustomError } from "../../shared/utils/custom-error";
import { FindUsersForChat } from "../../domain/interfaces/repository/booking.repository";

@injectable()
export class ConversationRepository
  extends BaseRepository<IConversation>
  implements IConversationRepository
{
  constructor() {
    super(Conversation);
  }

  async incrementUnreadCount(input: IncrementUnreadCount): Promise<void> {
    const { role, conversationId } = input;
    if (role === "client") {
      await this.update(conversationId, { $inc: { clientUnreadCount: 1 } });
    } else if (role === "vendor") {
      await this.update(conversationId, { $inc: { vendorUnreadCount: 1 } });
    }
  }

  async findConersations(input: FindUsersForChat): Promise<IConversation[]> {
    const { userId, userType } = input;
    console.log("in gete conversation repsoitory ✅✅✅");
    console.log(`userid : ${userId} , usertype : ${userType}`);
    if (userType === "client") {
      return await this.model.find({
        "client._id": userId,
      });
    } else {
      return await this.model.find({
        "vendor._id": userId,
      });
    }
  }
}
