import { ObjectId } from "mongoose";

export interface ICategory {
  _id: ObjectId;
  categoryId: string;
  title: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
