import { Types } from "mongoose";

export interface ICommunityMember {
  _id?: Types.ObjectId;
  communityId: Types.ObjectId;
  userId: Types.ObjectId;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}
