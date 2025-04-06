import mongoose from "mongoose";
import { IServiceModel } from "../models/service.model";
import { IWorkSampleModel } from "../models/work-sample.model";

export const workSampleSchema = new mongoose.Schema<IWorkSampleModel>({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  media: [
    {
      url: { type: String, required: true },
      type: { type: String, enum: ["image", "video"], required: true },
    },
  ],
  tags: [
    {
      type: String,
      lowercase: true,
      trim: true,
    },
  ],
  likes: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  isPublished: {
    type: Boolean,
    default: false,
  },
},
{
  timestamps : true
});
