import mongoose from "mongoose";
import { IClientModel } from "../models/client.model";

export const clientSchema = new mongoose.Schema<IClientModel>(
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
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    location: {
      type: String,
    },
    role: {
      type: String,
      enum: ["client", "vendor", "admin"],
      default: "client",
    },
    isblocked : {
      type : Boolean,
      required : true,
      default : false
    },
    isActive : {
      type : Boolean
    },
    savedPhotographers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Vendor",
      },
    ],
    savedPhotos: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Photo",
      },
    ],
  },
  { timestamps: true }
);
