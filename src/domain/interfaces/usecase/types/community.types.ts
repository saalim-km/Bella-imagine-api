import { Types } from "mongoose";
import { PaginationInput } from "./admin.types";
import { TRole } from "../../../../shared/constants/constants";
import { UserType } from "../../../models/community";

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
  slug : string
}

export interface JoinCommunityInput {
  userId : Types.ObjectId,
  communityId : Types.ObjectId,
  role : TRole
}

export interface LeaveCommunityInput extends JoinCommunityInput{}

export interface CreatePostInput {
  communityId: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  content?: string;    
  media ?: Express.Multer.File[];
  mediaType ?: 'image' | 'video' | 'mixed' | 'none';
  tags?: string[];
  role : 'Client' | 'Vendor'
}

export interface GetAllPostInput extends Omit<PaginationInput , 'search' | 'createdAt'> {
  communityId ?: Types.ObjectId;
  userId : Types.ObjectId
}

export interface EditPostInput {
  _id : Types.ObjectId
  communityId: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  content: string;    
  media ?: string[];
  mediaType?: 'image' | 'video' | 'mixed' | 'none';
  tags: string[];
}

export interface DeletePostInput {
  postId : Types.ObjectId;
  userId : Types.ObjectId;
}

export interface AddCommentInput {
  postId : Types.ObjectId
  userId : Types.ObjectId;
  content : string;
  role : TRole
}

export interface EditCommentInput {
  commentId : Types.ObjectId;
  content : string
}

export interface LikePostInput {
  postId : Types.ObjectId;
  userId : Types.ObjectId;
  role : TRole
}