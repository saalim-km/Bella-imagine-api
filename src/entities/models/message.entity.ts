// src/entities/message.entity.ts (Updated for emojis and live location)
import { ObjectId } from "mongoose";

export type MessageType = "text" | "image" | "video" | "file" | "location";
export type MessageStatus = "sent" | "delivered" | "read";

export interface Reaction {
  emoji: string; // e.g., "😊", "👍"
  userId: string;
  username: string;
  createdAt: Date;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface CreateMessageDTO {
  conversationId: string;
  senderId: string;
  text: string; // Can include emojis (e.g., "Hello 😊")
  type: MessageType;
  mediaUrl?: string; // For image, video, file
  mediaType?: string; // e.g., "image/jpeg"
  fileName?: string;
  fileSize?: number;
  location?: Location; // For live location sharing
}

export interface UpdateMessageDTO
  extends Partial<Omit<CreateMessageDTO, "conversationId" | "senderId">> {}

export interface ReactionDTO {
  messageId: string;
  userId: string;
  emoji: string;
  username: string;
}

export interface IMessageEntity {
  _id: string | ObjectId;
  conversationId: string | ObjectId;
  senderId: string | ObjectId;
  text: string;
  type: MessageType;
  mediaUrl?: string;
  mediaType?: string;
  fileName?: string;
  fileSize?: number;
  location?: Location;
  reactions: Reaction[];
  status: MessageStatus;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}