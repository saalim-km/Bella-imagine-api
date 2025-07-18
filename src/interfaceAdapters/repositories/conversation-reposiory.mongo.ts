import { injectable } from "tsyringe";
import { IConversationRepository } from "../../domain/interfaces/repository/conversation.repository";
import { BaseRepository } from "./base-repository.mongo";
import { Conversation } from "../database/schemas/conversation.schema";
import { IConversation } from "../../domain/models/chat";
import { IncrementUnreadCount } from "../../domain/types/chat.types";
import { FindUsersForChat } from "../../domain/interfaces/repository/booking.repository";
import { IClient } from "../../domain/models/client";
import { IVendor } from "../../domain/models/vendor";
import { Types } from "mongoose";

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
    if (userType === "client") {
      return await this.model
        .find({
          "user._id": userId,
        })
        .sort({ updatedAt: -1 });
    } else {
      return await this.model.find({
        "vendor._id": userId,
      });
    }
  }

  async findUsersForChat(
    input: FindUsersForChat
  ): Promise<IVendor[] | IClient[]> {
    const { userId, userType } = input;
    const isClient = userType == "client";

    console.log(userId, userType);

    const result: (IVendor | IClient)[] = await this.model.aggregate([
      {
        $match: {
          [isClient ? "user._id" : "vendor._id"]: new Types.ObjectId(userId),
        },
        $sort : { updatedAt: -1 },
      },
      {
        $group: {
          _id: `$${isClient ? "vendor._id" : "user._id"}`,
        },
      },
      {
        $lookup: {
          from: isClient ? "vendors" : "clients",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: "$user._id",
          role: "$user.role",
          isOnline: "$user.isOnline",
          lastSeen: "$user.lastSeen",
          name: "$user.name",
          avatar: "$user.profileImage",
        },
      },
    ]);

    console.log(" got the result from reppository : ", result);
    return result as typeof isClient extends true ? IClient[] : IVendor[];
  }
}
