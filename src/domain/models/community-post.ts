import { Types } from "mongoose";

export interface ICommunityPost {
  _id: string;
  communityId: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  content: string;
  media: string[];
  voteUpCount: number;
  voteDownCount: number;
  commentCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
