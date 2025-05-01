import { ObjectId } from "mongoose";

export interface ICommunityMemberEntity {
  _id?: string | ObjectId;
  communityId: string | ObjectId;
  userId: string | ObjectId;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}