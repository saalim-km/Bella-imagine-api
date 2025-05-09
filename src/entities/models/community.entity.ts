import { ObjectId } from "mongoose";

export interface ICommunityEntity {
  _id?: string | ObjectId; 
  slug?: string;
  name: string; 
  description: string; 
  rules: string[]; 
  coverImage: string | null; 
  iconImage: string | null; 
  isPrivate: boolean; 
  isFeatured: boolean; 
  memberCount: number; 
  postCount: number; 
  createdAt: Date; 
  updatedAt: Date; 
  __v: number;
}