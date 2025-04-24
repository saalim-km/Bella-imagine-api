// models/ChatRoom.ts
import { Schema } from "mongoose";
import { IChatRoomModel } from "../models/chat-room.model";

export const chatRoomSchema = new Schema<IChatRoomModel>({
  clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
  vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
  bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
  lastMessage: {
    content: { type: String },
    senderId: { type: Schema.Types.ObjectId,  required: false },
    senderType: { type: String, enum: ["Client", "Vendor"], required: false },
    createdAt: { type: Date },
  },
  unreadCountClient: { type: Number, default: 0 },
  unreadCountVendor: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

chatRoomSchema.index({ clientId: 1, vendorId: 1, bookingId: 1 }, { unique: true });