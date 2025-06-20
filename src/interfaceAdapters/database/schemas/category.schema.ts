import { model, Schema } from "mongoose";
import { ICategory } from "../../../domain/models/category";

export const CategorySchema = new Schema<ICategory>(
  {
    categoryId: { type: String, required: true },
    status: { type: Boolean, default: true },
    title: { type: String, required: true },
  },
  { timestamps: true }
);

export const Category = model<ICategory>('Category',CategorySchema)