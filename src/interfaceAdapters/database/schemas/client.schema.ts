import { Schema, model } from "mongoose";
import { IClient } from "../../../domain/models/client";

export const clientSchema = new Schema<IClient>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profileImage: {
      type: String,
    },
    password: {
      type: String,
    },
    phoneNumber: {
      type: Number,
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
    googleId: {
      type: String,
    },
    role: {
      type: String,
      enum: ["client", "vendor", "admin"],
      default: "client",
    },
    isblocked: {
      type: Boolean,
      required: true,
      default: false,
    },
    savedPhotographers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Vendor",
      },
    ],
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: { type: Date, default: Date.now },
    savedPhotos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Photo",
      },
    ],
  },
  { timestamps: true }
);

clientSchema.index({geoLocation : '2dsphere'})

export const Client = model<IClient>("Client", clientSchema);
