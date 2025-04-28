import mongoose, { Types } from "mongoose";
import { messageSchema } from "./message.schema";
import { IConversationModel } from "../models/conversation.model";
import { timeStamp } from "console";

const userSubSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
    role: { type: String, enum : ["client","vendor"],required: true },
    avatar: { type: String, required: true },
    isOnline: { type: Boolean, required: true },
    lastSeen: { type: Date },
  },
  { _id: false }
);

export const conversationSchema = new mongoose.Schema<IConversationModel>({
  bookingId: { type: String, required: true },
  client : userSubSchema,
  vendor : userSubSchema,
  lastMessage: messageSchema,
  clientUnreadCount: { type: Number, default: 0 },
  vendorUnreadCount : {type : Number , default : 0}
},{timestamps : true});

conversationSchema.index({ bookingId: 1 });