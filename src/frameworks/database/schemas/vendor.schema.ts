import mongoose from "mongoose";
import { IVendorEntity } from "../../../entities/models/vendor.entity";


export const vendorSchema = new mongoose.Schema<IVendorEntity>(
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
      type: String,
    },
    languages: {
      type: [String],
      default: [],
    },
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", 
      },
    ],
    isblocked: {
      type: Boolean,
      required: true,
      default: false,
    },
    isActive: {
      type: Boolean,
    },
    verificationDocuments: {
      type: [String],
    },
    isVerified: {
      type: String,
      enum: ["pending", "accept", "reject"],
      default: "pending",
    },
  },
  { timestamps: true }
);
