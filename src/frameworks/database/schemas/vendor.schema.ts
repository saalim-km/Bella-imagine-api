import mongoose from "mongoose";
import { IVendorEntity } from "../../../entities/models/vendor.entity";
import { boolean } from "zod";

export const vendorSchema = new mongoose.Schema<IVendorEntity>({
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
    default: "client",
  },
  profileImage: {
    type: String,
  },
  description: {
    type: String,
  },
  categories: {
    type: [String],
  },
  isblocked : {
    type : Boolean,
    required : true,
    default : false
  },
  isActive : {
    type : Boolean,
  },
  availableSlots: [
    {
      slotDate: {
        type: String,
      },
      slotBooked: {
        type: Boolean,
      },
    },
  ],
  notifications: [
    {
      type: String,
    },
  ],
  services : [
    {
        category : {
          type : mongoose.Types.ObjectId,
          ref : "Category"
        },
        duration : {
            type : Number
        },
        pricePerHour : {
            type : Number
        }
    }
  ],
  isVerified: {
    type : Boolean,
    default : false
  }
}, {timestamps : true});
