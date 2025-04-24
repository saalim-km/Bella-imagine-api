import { ObjectId } from "mongoose";

export interface ChatRoomResponse {
  id: string | ObjectId;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status: string;
  chatRoomId: string;
}

export interface IGetUserChatsUseCase {
  execute(userId: any, userType: "Client" | "Vendor"): Promise<any[]>;
}
