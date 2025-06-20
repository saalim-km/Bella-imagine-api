import mongoose, { Schema } from "mongoose";
import { IPayment } from "../../../domain/models/payment";

export const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "createrType",
    },
    bookingId: { type: Schema.Types.ObjectId, default: null },
    receiverId: {
      type: Schema.Types.ObjectId,
      default: null,
      refPath: "receiverType",
    },
    createrType: {
      type: String,
      required: true,
      enum: ["Client", "Vendor", "Admin"],
    },
    receiverType: {
      type: String,
      required: true,
      enum: ["Client", "Vendor", "Admin"],
    },
    transactionId: { type: String, required: true, unique: true },
    amount: { type: Number, min: 0, required: true },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "succeeded",
        "failed",
        "refunded",
        "partially_refunded",
      ],
      default: "pending",
    },
    paymentIntentId: { type: String },
    purpose: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

paymentSchema.index({ bookingId: 1 });

export const Payment = mongoose.model('Payment',paymentSchema)