import { Types } from "mongoose";

export interface ICategoryRequest {
  _id: Types.ObjectId;
  vendorId: Types.ObjectId;
  categoryId: Types.ObjectId;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}