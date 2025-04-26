import { ObjectId } from "mongoose";
import { TRole } from "../../shared/constants";

export interface Reaction {
  emoji: string;
  userId: string;
  username: string;
}

export type MessageType = 'text' | 'media' | 'location';
export type LocationType = {
  latitude: number;
  longitude: number;
  address?: string;
}
export interface  IMessageEntity {
  _id?: string | ObjectId;
  senderId: string | ObjectId
  conversationId: string | ObjectId
  text: string;
  timestamp: Date;
  type: MessageType;
  mediaUrl?: string;
  location?: LocationType
  reactions?: Reaction[];
  isDeleted: boolean;
  isRead ?: boolean;
  userType?: TRole;
  createdAt ?:  Date
  updatedAt ?:  Date
  __v ?:  number
}
