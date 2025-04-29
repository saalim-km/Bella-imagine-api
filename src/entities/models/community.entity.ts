import { ObjectId } from "mongoose";

export interface ICommunityEntity {
  _id: string | ObjectId; 
  name: string; 
  description: string; 
  rules: string[]; 
  coverImageUrl: string | null; 
  iconImageUrl: string | null; 
  isPrivate: boolean; 
  isFeatured: boolean; 
  memberCount: number; 
  postCount: number; 
  createdAt: Date; 
  updatedAt: Date; 
  __v: number;
}