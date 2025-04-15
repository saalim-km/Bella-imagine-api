import { ObjectId } from "mongoose";

export interface TComment {
  _id?: string | ObjectId;
  userId: string | ObjectId;
  comment: string;
}
export interface IContestUploadEntity {
  _id?: string | ObjectId;
  title: string;
  caption: string;
  image : string;
  categoryId: string | ObjectId;
  contestId: string | ObjectId;
  likeCount: number;
  comment: TComment[];
  createdAt?: Date;
  updatedAt?: Date;
}
