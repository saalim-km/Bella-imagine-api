import { IChatRoomEntity } from "../../models/chat-room";

export interface ICreateChatRoomUseCase {
  execute(clientId: string, vendorId: string): Promise<IChatRoomEntity>;
}
