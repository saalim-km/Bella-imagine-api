import { IMessageEntity } from "../../models/message.entity";

export interface IMessageRepository {
  create(message: IMessageEntity): Promise<IMessageEntity>;

  findByChatRoomId(chatRoomId: any): Promise<IMessageEntity[]>;

  markAsRead(chatRoomId: string, userId: string, userType: "Client" | "Vendor"): Promise<void>;
}
