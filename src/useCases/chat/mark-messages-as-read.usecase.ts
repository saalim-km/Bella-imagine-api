import { inject, injectable } from "tsyringe";
import { IChatRoomRepository } from "../../entities/repositoryInterfaces/chat/chat-room-repository.interface";
import { IMessageRepository } from "../../entities/repositoryInterfaces/chat/message-repository.interface";
import { IMarkMessagesAsReadUseCase } from "../../entities/usecaseInterfaces/chat/mark-messages-as-read-usecase.inteface";

@injectable()
export class MarkMessagesAsReadUseCase implements IMarkMessagesAsReadUseCase {
  constructor(
    @inject("IMessageRepository") private messageRepository: IMessageRepository,
    @inject("IChatRoomRepository")
    private chatRoomRepository: IChatRoomRepository
  ) {}
  async execute(
    chatRoomId: string,
    userId: string,
    userType: "Client" | "Vendor"
  ): Promise<void> {
    await this.messageRepository.markAsRead(chatRoomId, userId, userType);

    const recipientType = userType === "Client" ? "client" : "vendor";
    await this.chatRoomRepository.resetUnreadCount(chatRoomId, recipientType);
  }
}
