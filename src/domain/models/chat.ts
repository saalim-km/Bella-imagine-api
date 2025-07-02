import { Types } from "mongoose";
import { TRole } from "../../shared/constants/constants";

export interface Reaction {
  emoji: string;
  userId: string;
  username: string;
}

export interface IUserEntityForChat {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: TRole;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
}

export type MessageType = 'text' | 'image' | 'location' | 'video' | 'document'

export type LocationType = {
  latitude: number;
  longitude: number;
  address?: string;
}
export interface  IMessage {
  _id?: Types.ObjectId;
  senderId: Types.ObjectId
  conversationId: Types.ObjectId
  text: string;
  timestamp: Date;
  type: MessageType;
  mediaKey?: string;
  location?: LocationType
  reactions?: Reaction[];
  isDeleted?: boolean;
  isRead ?: boolean;
  userType: TRole;
  createdAt ?: Date
  updatedAt ?: Date
  mediaUrl?: string
}


export interface IConversation {
  _id?: Types.ObjectId
  user : Partial<IUserEntityForChat>
  vendor : Partial<IUserEntityForChat>
  lastMessage?: IMessage;
  userUnreadCount?: number;
  vendorUnreadCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}