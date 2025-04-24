import { ObjectId } from "mongoose";

export interface IChatRoomEntity {
  _id?: string | ObjectId;
  clientId: string | ObjectId;
  vendorId: string | ObjectId;
  bookingId: string | ObjectId;
  lastMessage: {
    content: string,
    senderId: string | ObjectId,
    senderType: "Client" | "Vendor"
    createdAt: Date 
  },
  unreadCountClient: number;
  unreadCountVendor: number;
  createdAt?: Date;
  updatedAt?: Date; 
}
