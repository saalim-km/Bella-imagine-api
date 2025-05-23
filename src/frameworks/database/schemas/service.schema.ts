import mongoose, { Document } from "mongoose";
import { IServiceModel } from "../models/service.model";

export const serviceSchema = new mongoose.Schema<IServiceModel>({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  yearsOfExperience : {
    type : Number,
    required : true
  },
  serviceTitle: {
    type: String,
    required: true,
  },
  serviceDescription: {
    type: String,
  },
  styleSpecialty: {
    type: [String],
  },
  sessionDurations: [
    {
      durationInHours: {
        type: Number,
      },
      price: {
        type: Number,
      },
    },
  ],
  features: [String],
  location: {
    travelFee: {
      type: Number,
    },
    lat : {
      type: Number,
      required: true
    },
    lng : {
      type: Number,
      required: true
    },
  },
  equipment: [String],
  cancellationPolicies: {
    type : [String],
  },
  termsAndConditions : {
    type : [String]
  },
  availableDates: [
    {
      date: { type: String },
      timeSlots: [
        {
          startTime: { type: String  },
          endTime: { type: String  },
          capacity: { type: Number  },
          isBooked: {type : Boolean , default : false}
        },
      ],
    },
  ],
  tags: [String],
  isPublished: {
    type: Boolean,
    default: false,
  }
})