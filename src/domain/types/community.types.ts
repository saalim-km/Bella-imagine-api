import { Types } from "mongoose";
import { ICommunity, UserType } from "../models/community";
import { PaginationQuery } from "./admin.type";

export interface FetchAllCommunityInput extends Omit<PaginationQuery<ICommunity> , 'sort'> {}

export interface FetchCommunityBySlugOutput {
    community : ICommunity;
    isMember : boolean
}

export interface FetchAllCommunitiesForUsersInput extends Omit<PaginationQuery<ICommunity>,'sort'> {
    membership ?: 'member' | 'non-member'
    sort ?: Record<string,number>
    userId : Types.ObjectId
}


export interface ICommunityPostResponse {
  _id ?: Types.ObjectId;
  communityId: Types.ObjectId;
  userId: {
    name : string;
    profileImage : string;
  }
  userType: UserType
  title: string;
  content: string;    
  media: string[];
  mediaType?: 'image' | 'video' | 'mixed' | 'none';
  
  isEdited ?: boolean;

  likeCount : number;
  commentCount: number;
  tags: string[];
  comments : Types.ObjectId[];
  isLiked ?: boolean;
  createdAt ?: string;
  updatedAt ?: string;
}