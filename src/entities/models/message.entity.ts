import { ObjectId } from "mongoose";

export interface Reaction {
  emoji: string;
  userId: string;
  username: string;
}

export type MessageType = 'text' | 'image' | 'video' | 'file' | 'location';
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
  mediaType?: string;
  fileName?: string;
  fileSize?: number;
  location?: LocationType
  reactions?: Reaction[];
  isDeleted: boolean;
  isRead ?: boolean;
  createdAt ?:  Date
  updatedAt ?:  Date
  __v ?:  number
}
