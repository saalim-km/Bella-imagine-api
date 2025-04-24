import { IChatRoomEntity } from "../../models/chat-room";
import { IMessageEntity } from "../../models/message.entity";

export interface IGetChatHistoryUseCase {
  execute(
    chatRoomId: any
  ): Promise<{ chatRoom: IChatRoomEntity; messages: IMessageEntity[] }>;
}
