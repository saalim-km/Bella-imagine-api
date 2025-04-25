import mongoose from "mongoose";
import { messageSchema } from "./message.schema";
import { IConversationModel } from "../models/conversation.model";
import { timeStamp } from "console";

export const conversationSchema = new mongoose.Schema<IConversationModel>({
  bookingId: { type: String, required: true },
  participants: [
    {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      profileImage: { type: String },
      isOnline: { type: Boolean, default: false },
      lastSeen: { type: Date },
    },
  ],
  lastMessage: messageSchema,
  clientUnreadCount: { type: Number, default: 0 },
  vendorUnreadCount : {type : Number , default : 0}
},{timestamps : true});

conversationSchema.index({ bookingId: 1 });
conversationSchema.index({ "participants._id": 1 });