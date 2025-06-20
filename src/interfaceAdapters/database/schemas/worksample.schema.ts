import mongoose, { model } from "mongoose";
import { IWorkSample } from "../../../domain/models/worksample";

export const workSampleSchema = new mongoose.Schema<IWorkSample>({
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
  media: [String],
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

export const WorkSample = model('WorkSample',workSampleSchema)