import { model, Schema } from "mongoose";
import { INotification } from "../../../domain/models/notification";

export const notificationSchema = new Schema<INotification>(
  {
    type: { 
      type: String, 
      required: true,
      enum: ['booking', 'chat', 'contest', 'review', 'system', 'custom']
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },

    // Dynamic refs for receiver
    receiverId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "receiverModel",
    },
    receiverModel: {
      type: String,
      required: true,
      enum: ["Client", "Vendor"], // these must match your model names
    },

    // Dynamic refs for sender
    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "senderModel",
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["Client", "Vendor"],
    },

    actionUrl: { type: String },
    meta: { type: Schema.Types.Mixed },
    readAt: { type: Date },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);
         
export const Notification = model<INotification>('Notification',notificationSchema)