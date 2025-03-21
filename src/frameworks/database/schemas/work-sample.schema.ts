import { Schema } from "mongoose";
import { IWorkSampleModel } from "../models/work-sample.model";

export const workSampleSchema = new Schema<IWorkSampleModel>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: false }, 
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: false }, 
    title: { type: String, required: true },
    description: { type: String, required: true },
    media: [
      {
        type: String,
        required: true,
        validate: [(media: string[]) => media.length > 0, "At least one media file is required"],
      },
    ], 
    tags: [{ type: String }],

    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likeCount: { type: Number, default: 0 }, 

    comments: [
      {
        client: { type: Schema.Types.ObjectId, ref: "Client", required: true },
        text: { type: String, required: true }, 
        createdAt: { type: Date, default: Date.now },
      },
    ],

    sharedBy: [{ type: Schema.Types.ObjectId, ref: "Client" }],
    shareCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);
