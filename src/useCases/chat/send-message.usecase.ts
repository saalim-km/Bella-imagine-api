// usecases/chat/send-message.usecase.ts
import { injectable, inject } from "tsyringe";
import { IMessageEntity } from "../../entities/models/message.entity";
import { IMessageRepository } from "../../entities/repositoryInterfaces/chat/message-repository.interface";
import { IChatRoomRepository } from "../../entities/repositoryInterfaces/chat/chat-room-repository.interface";
import { CustomError } from "../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { ISendMessageUseCase } from "../../entities/usecaseInterfaces/chat/send-message-usecase.interface";

@injectable()
export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    @inject("IMessageRepository") private messageRepository: IMessageRepository,
    @inject("IChatRoomRepository") private chatRoomRepository: IChatRoomRepository
  ) {}

  async execute(
    clientId: string,
    vendorId: string,
    senderId: string,
    senderType: "Client" | "Vendor",
    content: string,
    chatRoomId?: string,
    bookingId?: string
  ): Promise<IMessageEntity> {
    let chatRoom;
  
    if (chatRoomId) {
      chatRoom = await this.chatRoomRepository.findById(chatRoomId);
      if (!chatRoom) throw new CustomError('chat not found', HTTP_STATUS.NOT_FOUND);
    } else {
      if (!bookingId) throw new CustomError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
      chatRoom = await this.chatRoomRepository.findOrCreate(
        clientId,
        vendorId,
        bookingId,
        {
          content,
          senderId,
          senderType,
          createdAt: new Date(),
        }
      );
    }
  
    const message: IMessageEntity = {
      chatRoomId: chatRoom._id!.toString(),
      content,
      senderId,
      senderType,
      read: false,
      createdAt: new Date(),
    };
    const createdMessage = await this.messageRepository.create(message);
  
    await this.chatRoomRepository.updateLastMessage(
      chatRoom._id!.toString(),
      content,
      senderId,
      senderType,
      createdMessage.createdAt!
    );
  
    if (senderType === "Client") {
      await this.chatRoomRepository.incrementUnreadCount(chatRoom._id!.toString(), "vendor");
    } else {
      await this.chatRoomRepository.incrementUnreadCount(chatRoom._id!.toString(), "client");
    }
  
    return createdMessage;
  }
}