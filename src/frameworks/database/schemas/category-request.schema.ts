import { Schema } from "mongoose";
import { ICategoryRequestModel } from "../models/catgory-request.model";

export const CategoryRequestSchema = new Schema<ICategoryRequestModel>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor" },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
