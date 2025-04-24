import { inject, injectable } from "tsyringe";
import { IChatRoomRepository } from "../../entities/repositoryInterfaces/chat/chat-room-repository.interface";
import { IChatRoomEntity } from "../../entities/models/chat-room";
import { ICreateChatRoomUseCase } from "../../entities/usecaseInterfaces/chat/create-chat-room-usecase.interface";

@injectable()
export class CreateChatRoomUseCase implements ICreateChatRoomUseCase {
  constructor(
    @inject("IChatRoomRepository")
    private chatRoomRepository: IChatRoomRepository
  ) {}

  async execute(clientId: string, vendorId: string): Promise<IChatRoomEntity> {
    const chatRoom = await this.chatRoomRepository.findOrCreate(
      clientId,
      vendorId,
      "",
      {
        content: "",
        senderId: "",
        senderType: "Client",
        createdAt: new Date(),
      }
    );
    return chatRoom;
  }
}
