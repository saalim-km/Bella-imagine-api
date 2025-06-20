import { model, Schema } from "mongoose";
import { IVendor } from "../../../domain/models/vendor";

export const vendorSchema = new Schema<IVendor>(
  {
    vendorId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phoneNumber: {
      type: Number,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },
    location: {
      address: {
        type: String,
      },
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
    geoLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    languages: {
      type: [String],
      default: [],
    },
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    workSamples: [
      {
        type: Schema.Types.ObjectId,
        ref: "WorkSample",
      },
    ],
    role: {
      type: String,
      enum: ["client", "vendor", "admin"],
      default: "vendor",
    },
    profileImage: {
      type: String,
    },
    description: {
      type: String,
    },
    portfolioWebsite: {
      type: String,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    isblocked: {
      type: Boolean,
      required: true,
      default: false,
    },
    verificationDocument: {
      type: String,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: { type: Date, default: Date.now },
    isVerified: {
      type: String,
      enum: ["pending", "accept", "reject"],
      default: "pending",
    },
  },
  { timestamps: true }
);

vendorSchema.index({geoLocation : '2dsphere'});

export const Vendor = model<IVendor>("Vendor", vendorSchema);
