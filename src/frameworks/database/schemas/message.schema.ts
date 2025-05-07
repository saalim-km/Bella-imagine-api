import mongoose from "mongoose";
import { IMessageModel } from "../models/message.model";

export const messageSchema = new mongoose.Schema<IMessageModel>(
  {
    senderId: { type: mongoose.Types.ObjectId, required: true },
    conversationId: {
      type: mongoose.Types.ObjectId,
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
