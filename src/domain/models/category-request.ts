import { ObjectId } from "mongoose";

export interface ICategoryRequest {
  _id: ObjectId;
  vendorId: ObjectId;
  categoryId: ObjectId;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}