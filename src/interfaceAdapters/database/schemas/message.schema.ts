import mongoose, { model } from "mongoose";
import { IMessage } from "../../../domain/models/chat";

export const messageSchema = new mongoose.Schema<IMessage>(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    text: { type: String },
    timestamp: { type: Date, required: true },
    type: {
      type: String,
      enum: ['text','image','location','video','document'],
      required: true,
    },
    mediaKey: { type: String },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
      address: { type: String },
    },
    reactions: [
      {
        emoji: { type: String, required: true },
        userId: { type: String, required: true },
        username: { type: String, required: true },
      },
    ],
    isDeleted: { type: Boolean, default: false },
    isRead : {
      type: Boolean,
      default : false
    }
  },
  { timestamps: true }
);


export const Message = model<IMessage>("Message", messageSchema);