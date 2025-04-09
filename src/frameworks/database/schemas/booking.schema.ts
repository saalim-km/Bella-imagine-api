import { Schema } from "mongoose";
import { IBookingModel } from "../models/booking.model";

export const bookingSchema = new Schema<IBookingModel>({
  userId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
  vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },

  paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },

  isClientApproved: { type: Boolean, default: false },
  isVendorApproved: { type: Boolean, default: false },

  serviceDetails: {
    serviceTitle: { type: String, required: true },
    serviceDescription: { type: String, required: true },
    cancellationPolicies: { type: [String], required: true },
    termsAndConditions: { type: [String], required: true },
  },

  bookingDate: { type: String, required: true },
  timeSlot: {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },

  totalPrice: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: [
      "pending",
      "completed",
      "failed",
      "refunded",
    ],
    default: "pending",
  },

  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },

  createdAt: { type: Date, default: Date.now },
});

bookingSchema.index({ paymentId: 1 });