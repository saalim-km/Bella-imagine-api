import mongoose from "mongoose";

const customSchemaField = new mongoose.Schema({
  fieldName: {
    type: String,
    required: true,
  },
  fieldType: {
    type: String,
    enum: ["string", "number", "boolean", "array", "date"],
    required: true,
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



export const serviceSchema = new mongoose.Schema({
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
  serviceName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  styleSpecialty: {
    type: [String],
    enum: [
      "portrait",
      "wedding",
      "commercial",
      "event",
      "family",
      "newborn",
      "product",
      "real estate",
      "other",
    ],
    required: true,
  },
  sessionDurations: [
    {
      durationInHours: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  features: [String],
  customFields: [customSchemaField],
  locationOptions: {
    studio: {
      type: Boolean,
      default: false,
    },
    onLocation: {
      type: Boolean,
      default: false,
    },
    travelFee: {
      type: Number,
      default: 0,
    },
  },
  equipmentIncluded: [String],
  portfolioSamples: [String],
  depositRequired: {
    amount: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
  },
  cancellationPolicy: {
    deadline: { type: Number, default: 48 },
    refundPercentage: { type: Number, default: 50 },
  },
  availableDates: [
    {
      date: { type: String, required: true },
      availableHours: {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
      },
      bufferTime: { type: Number, default: 15 },
    },
  ],
  recurringAvailability: [
    {
      dayOfWeek: { type: Number, min: 0, max: 6 },
      startTime: String,
      endTime: String,
    },
  ],
  blackoutDates: [String],
  maxBookingsPerDay: { type: Number, default: 3 },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  tags: [String],
});
