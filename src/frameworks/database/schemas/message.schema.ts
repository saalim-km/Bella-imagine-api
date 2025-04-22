import { Schema } from "mongoose";
import { Reaction, Location } from "../../../entities/models/message.entity";
import { IMessageModel } from "../models/message.model";

const LocationSchema = new Schema<Location>(
  {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
    },
  },
  { _id: false }
);

const ReactionSchema = new Schema<Reaction>(
  {
    emoji: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

export const MessageSchema = new Schema<IMessageModel>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "image", "video", "file", "location"],
      default: "text",
    },
    mediaUrl: {
      type: String,
    },
    mediaType: {
      type: String,
    },
    fileName: {
      type: String,
    },
    fileSize: {
      type: Number,
    },
    location: {
      type: LocationSchema,
    },
    reactions: {
      type: [ReactionSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
