import { Types } from "mongoose";
import { PaginationInput } from "./admin.types";

export interface BaseCommunityInput {
  name: string;
  category : Types.ObjectId;
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

export interface FetchAllCommunitiesInput extends Omit<PaginationInput,'createdAt'> {
  sort ?: Record<string,number>
  membership ?: 'member' | 'non-member'
  category ?: Types.ObjectId
  userId : Types.ObjectId
}

export interface GetCommunityMemberInput extends Omit<PaginationInput , 'search' | 'createdAt'> {
  communityId : Types.ObjectId
}

export interface JoinCommunityInput {
  userId : Types.ObjectId,
  communityId : Types.ObjectId
}

export interface LeaveCommunityInput extends JoinCommunityInput{}