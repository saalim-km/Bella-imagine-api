import { ObjectId } from "mongoose";

export interface ICategoryRequestEntity {
  _id?: ObjectId;
  vendorId: ObjectId;
  categoryId: ObjectId;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
