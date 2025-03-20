import { model } from "mongoose";
import { CategoryRequestSchema } from "../schemas/category-request.schema";
import { ICategoryRequestEntity } from "../../../entities/models/category-request.entity";

export interface ICategoryRequestModel
  extends ICategoryRequestEntity,
    Document {}

export const CategoryRequestModel = model<ICategoryRequestModel>(
  "CategoryRequest",
  CategoryRequestSchema
);
