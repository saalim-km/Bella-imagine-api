import { Types } from "mongoose";
import { TComment, TMedia } from "../../shared/types/service.types";

export interface IWorkSample {
  _id?: Types.ObjectId;
  service: Types.ObjectId;
  vendor: Types.ObjectId;
  title: string;
  description?: string;
  media: TMedia[];
  tags: string[];
  likes: string[];
  comments: TComment;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt ?: string;
  __v?: number;
}