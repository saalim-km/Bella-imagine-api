import { Types } from "mongoose";
import { IComment, ICommunity, ICommunityMember, ILike, UserType } from "../models/community";
import { PaginationQuery } from "./admin.type";
import { IClient } from "../models/client";
import { TRole } from "../../shared/constants/constants";

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

export interface GetPostDetailsInput {
  postId : Types.ObjectId;
  userId : Types.ObjectId;
  limit : number;
  page : number
}

export interface PostDetailsResponse extends  Omit<ICommunityPostResponse,'comments'> {
  likes : ILike;
  comments : IComment[];
  totalComments : number
  userName : string;
  avatar : string;
}

export interface CommunityMembersOutput extends Omit<ICommunityMember , 'userId'> {
  userId : {
    _id : string;
    name : string;
    profileImage : string
  }
}

export interface GetComentsInput {
  userId : Types.ObjectId;
  skip : number;
  limit : number;
}

export interface GetCommentUsecaseInput {
  userId : Types.ObjectId;
  page : number;
  limit : number;
}