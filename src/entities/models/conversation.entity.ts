import { ObjectId } from "mongoose";
import { IMessageEntity } from "./message.entity";
import { IUserEntityForChat } from "./iuser.entity";

export interface IConversationEntity {
  _id?: string | ObjectId
  participants: Partial<IUserEntityForChat>[];
  lastMessage?: IMessageEntity;
  bookingId : string | ObjectId;
  clientUnreadCount?: number;
  vendorUnreadCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}