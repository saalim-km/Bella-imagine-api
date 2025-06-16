import { Types } from "mongoose";

export interface ICommunity {
  _id?: Types.ObjectId;
  slug: string;
  name: string;
  description: string;
  rules: string[];
  coverImage: string;
  iconImage: string;
  isPrivate: boolean;
  isFeatured: boolean;
  memberCount: number;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}
