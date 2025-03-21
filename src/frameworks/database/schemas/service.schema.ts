import mongoose from "mongoose";

export const serviceSchema = new mongoose.Schema({
  photographer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  serviceName: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  sessionDurations: [
    {
      durationInMinutes: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  availableDates: [
    {
      date: { type: String, required: true },
      availableHours: {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
      },
      bufferTime: { type: Number, default: 15 },
      bookedSlots: [
        {
          client: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          startTime: { type: String, required: true },
          endTime: { type: String, required: true },
          status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending",
          },
        },
      ],
    },
  ],
  location: {
    city: { type: String },
    state: { type: String },
    country: { type: String },
  },
  paymentRequired: { type: Boolean, default: true },
  cancellationPolicy: { type: String },
});
