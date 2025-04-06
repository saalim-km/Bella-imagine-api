import { ObjectId } from "mongoose";
import { TComment, TMedia } from "../../shared/types/vendor/work-sample.types";

export interface IWorkSampleEntity {
  _id ?: ObjectId | string;
  service: ObjectId | string;
  vendor: ObjectId | string;
  title: string;
  description?: string;
  media: TMedia[];
  tags?: string[];
  likes?: string[];
  comments?: TComment;
  isPublished: boolean;
  createdAt ?: Date;
  __v ?: number;
}
