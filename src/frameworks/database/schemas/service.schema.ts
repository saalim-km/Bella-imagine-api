import mongoose, { Document } from "mongoose";
import { IServiceModel } from "../models/service.model";

const customSchemaField = new mongoose.Schema({
  name: {
    type: String,
  },
  type: {
    type: String,
    enum: ["string", "number", "boolean", "array", "date"],
  },
  required: {
    type: Boolean,
    default: false,
  },
  options: {
    type: [String],
    default: [],
  },
});

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
  customFields: [customSchemaField],
  location: {
    options: {
      studio: {
        type: Boolean,
      },
      onLocation: {
        type: Boolean,
      },
    },
    travelFee: {
      type: Number,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  equipment: [String],
  portfolioImages: [String],
  cancellationPolicies: {
    deadline: {
      type: Number,
      default: 48,
    },
    refundPercentage: {
      type: Number,
      default: 50,
    },
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