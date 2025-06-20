import mongoose, { Schema } from "mongoose";
import { messageSchema } from "./message.schema";
import { IConversation } from "../../../domain/models/chat";

const userSubSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["client", "vendor"], required: true },
    avatar: { type: String },
    isOnline: { type: Boolean, required: true },
    lastSeen: { type: Date },
  },
  { _id: false }
);

export const conversationSchema = new mongoose.Schema<IConversation>(
  {
    bookingId: { type: Schema.Types.ObjectId, required: true },
    client: userSubSchema,
    vendor: userSubSchema,
    lastMessage: messageSchema,
    clientUnreadCount: { type: Number, default: 0 },
    vendorUnreadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

conversationSchema.index({ bookingId: 1 });

export const Conversation = mongoose.model<IConversation>("Conversation",conversationSchema)