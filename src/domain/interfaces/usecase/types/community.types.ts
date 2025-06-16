import { Types } from "mongoose";
import { PaginationInput } from "./admin.types";

export interface BaseCommunityInput {
  name: string;
  description: string;
  rules: string[];
  isPrivate: boolean;
  isFeatured: boolean;
  coverImage?: Express.Multer.File;
  iconImage?: Express.Multer.File;
}

export interface CreateCommunityInput extends BaseCommunityInput {
}

export interface FetchCommuityInput extends Omit<PaginationInput , 'createdAt'>{}

export interface fetchCommBySlugInput {
  userId : Types.ObjectId,
  slug : string
}

export interface UpdateCommunityInput extends BaseCommunityInput {
_id : Types.ObjectId
}