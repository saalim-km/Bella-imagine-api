// src/entities/conversation.entity.ts
import { ObjectId } from "mongoose";
import { IMessageEntity } from "./message.entity";
import { IClientEntity } from "./client.entity";
import { IVendorEntity } from "./vendor.entity";


export interface IConversationEntity {
  _id?: string | ObjectId;
  clientId: string | ObjectId;
  vendorId: string | ObjectId;
  bookingId: string | ObjectId; // Link to booking
  lastMessage?: string | ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationWithParticipants {
  _id: string;
  clientId: Partial<IClientEntity>
  vendorId: Partial<IVendorEntity>
  bookingId ?: string | ObjectId;
  lastMessage : IMessageEntity;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateConversationDTO {
  clientId: string | ObjectId
  vendorId: string | ObjectId
  bookingId: string | ObjectId
}

export interface UpdateConversationDTO {
  lastMessage?: IMessageEntity;
}