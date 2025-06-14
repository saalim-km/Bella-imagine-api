import mongoose, { Schema } from "mongoose";
import { IBooking } from "../../../domain/models/booking";

const bookingSchema = new mongoose.Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment", default: null },

    isClientApproved: { type: Boolean, default: false },
    isVendorApproved: { type: Boolean, default: false },

    serviceDetails: {
      _id: { type: Schema.Types.ObjectId, required: true },
      serviceTitle: { type: String, required: true },
      serviceDescription: { type: String, required: true },
      cancellationPolicies: { type: [String], default: [] },
      termsAndConditions: { type: [String], default: [] },
      location : {
        lat : { type: Number, required: true },
        lng : { type: Number, required: true },
        address: { type: String, required: true }
      }
    },

    bookingDate: { type: String, required: true },

    timeSlot: {
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },

    location: {
      lat: { type: Number, required: true },  
      lng: { type: Number, required: true },
    },
    travelTime: { type: String, default: 0 }, // in minutes
    distance: { type: Number, default: 0 },
    travelFee: { type: Number, default: 0 },

    totalPrice: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["pending", "completed", "failed"], required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled", "completed"], required: true },

    customLocation: { type: String, default: "" },

    createrType: { type: String, enum: ["Client", "Vendor"], default: "Client" },
    receiverType: { type: String, enum: ["Client", "Vendor"], default: "Vendor" },
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
