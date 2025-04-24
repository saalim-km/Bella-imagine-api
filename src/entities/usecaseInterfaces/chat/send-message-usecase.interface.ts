import { IMessageEntity } from "../../models/message.entity";

export interface ISendMessageUseCase {
  execute(
    clientId: string,
    vendorId: string,
    senderId: string,
    senderType: "Client" | "Vendor",
    content: string,
    chatRoomId?: string,
  ): Promise<IMessageEntity>;
}
