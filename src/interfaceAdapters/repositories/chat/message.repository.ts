import { injectable } from "tsyringe";
import { IMessageRepository } from "../../../entities/repositoryInterfaces/chat/message-repository.interface";
import {
  CreateMessageDTO,
  MessageStatus,
  IMessageEntity,
  ReactionDTO,
  UpdateMessageDTO,
} from "../../../entities/models/message.entity";
import { MessageModel } from "../../../frameworks/database/models/message.model";

@injectable()
export class MessageRepository implements IMessageRepository {
  async create(dto: CreateMessageDTO): Promise<void> {
    await MessageModel.create(dto);
  }

  async findById(id: string): Promise<IMessageEntity | null> {
    return MessageModel.findById(id).lean();
  }

  async findByConversationId(
    conversationId: string,
    limit = 50,
    skip = 0
  ): Promise<IMessageEntity[]> {
    return MessageModel.find({ conversationId, isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async update(
    id: string,
    dto: UpdateMessageDTO
  ): Promise<IMessageEntity | null> {
    return MessageModel.findByIdAndUpdate(id, dto, { new: true }).lean();
  }

  async updateStatus(
    id: string,
    status: MessageStatus
  ): Promise<IMessageEntity | null> {
    return MessageModel.findByIdAndUpdate(id, { status }, { new: true }).lean();
  }

  async addReaction(dto: ReactionDTO): Promise<IMessageEntity | null> {
    return MessageModel.findByIdAndUpdate(
      dto.messageId,
      {
        $push: {
          reactions: {
            emoji: dto.emoji,
            userId: dto.userId,
            username: dto.username,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    ).lean();
  }

  async delete(id: string): Promise<IMessageEntity | null> {
    return MessageModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    ).lean();
  }
}
