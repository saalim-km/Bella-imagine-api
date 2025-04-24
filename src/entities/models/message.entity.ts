import { ObjectId } from "mongoose";

export interface IMessageEntity {
  _id?: string | ObjectId;
  chatRoomId: string | ObjectId;
  content: string;
  senderId: string;
  senderType: "Client" | "Vendor";
  read: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
