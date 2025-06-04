import { Types } from "mongoose";

export interface ICategory {
  _id: Types.ObjectId;
  categoryId: string;
  title: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
