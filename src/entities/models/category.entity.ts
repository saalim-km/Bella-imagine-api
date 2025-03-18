import { ObjectId } from "mongoose";

export interface ICategoryEntity {
  _id?: ObjectId;
  categoryId: string;
  title: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}