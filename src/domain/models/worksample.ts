import { Types } from "mongoose";
import { TComment } from "../../shared/types/service.types";

export interface IWorkSample {
  _id?: Types.ObjectId;
  service: Types.ObjectId;
  vendor: Types.ObjectId;
  title: string;
  description?: string;
  media: string[];
  tags?: string[];
  likes?: string[];
  comments?: TComment;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt ?: string;
}