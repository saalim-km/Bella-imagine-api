import { IChatRoomModel } from "../../../frameworks/database/models/chat-room.model";
import { IChatRoomEntity } from "../../models/chat-room";
import {  } from "../../models/message.entity";

export interface IChatRoomRepository {
  findById(id: any): Promise<IChatRoomEntity | null>;

  findByClientId(clientId: any): Promise<IChatRoomEntity[]>;

  findByVendorId(vendorId: any): Promise<IChatRoomEntity[]>;

  findOrCreate(
    clientId: string,
    vendorId: string,
    bookingId: string,
    lastMessage: {
      content: string;
      senderId?: string;
      senderType?: "Client" | "Vendor";
      createdAt: Date;
    }
  ): Promise<IChatRoomEntity>;

  updateLastMessage(
    chatRoomId: string,
    content: string,
    senderId: string,
    senderType: "Client" | "Vendor",
    createdAt: Date
  ): Promise<void>;

  incrementUnreadCount(
    chatRoomId: string,
    recipientType: "client" | "vendor"
  ): Promise<void>;

  create(data: {
    clientId: any;
    vendorId: any;
    bookingId: any;
  }): Promise<IChatRoomModel>;

  findByClientAndVendorAndBooking(
    clientId: any,
    vendorId: any,
    bookingId: any
  ): Promise<IChatRoomModel | null>;

  resetUnreadCount(
    chatRoomId: string,
    recipientType: "client" | "vendor"
  ): Promise<void>;
}
