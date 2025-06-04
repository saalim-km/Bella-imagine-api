import { model, Schema } from "mongoose";
import { ICategoryRequest } from "../../../domain/models/category-request";

export const CategoryRequestSchema = new Schema<ICategoryRequest>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor" },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const CategoryRequest = model<ICategoryRequest>('CategoryRequest',CategoryRequestSchema)