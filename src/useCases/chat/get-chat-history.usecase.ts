import { inject, injectable } from "tsyringe";
import { IMessageEntity } from "../../entities/models/message.entity";
import { IMessageRepository } from "../../entities/repositoryInterfaces/chat/message-repository.interface";
import { IChatRoomRepository } from "../../entities/repositoryInterfaces/chat/chat-room-repository.interface";
import { IChatRoomEntity } from "../../entities/models/chat-room";
import { IGetChatHistoryUseCase } from "../../entities/usecaseInterfaces/chat/get-chat-history-usecase.interface";

@injectable()
export class GetChatHistoryUseCase implements IGetChatHistoryUseCase {
  constructor(
    @inject("IMessageRepository") private messageRepository: IMessageRepository,
    @inject("IChatRoomRepository")
    private chatRoomRepository: IChatRoomRepository
  ) {}

  async execute(
    chatRoomId: any
  ): Promise<{ chatRoom: IChatRoomEntity; messages: IMessageEntity[] }> {
    const messages = await this.messageRepository.findByChatRoomId(chatRoomId);
    const chatRoom = await this.chatRoomRepository.findById(chatRoomId);
    if (!chatRoom) throw new Error("Chat room not found");
    return { chatRoom, messages };
  }
}