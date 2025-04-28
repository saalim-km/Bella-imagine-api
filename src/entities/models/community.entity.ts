import { ObjectId } from "mongoose";

export interface ICommunityEntity {
  _id: string | ObjectId; // Primary key, UUID
  name: string; // Community name (e.g., "r/Landscape")
  description: string; // Community description
  rules: string[]; // Community rules
  coverImageUrl: string | null; // Cover image URL
  iconImageUrl: string | null; // Icon image URL
  isPrivate: boolean; // Whether community is private
  isFeatured: boolean; // Whether community is featured
  memberCount: number; // Cached count of members
  postCount: number; // Cached count of posts
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last update timestamp
  __v: number;
}
