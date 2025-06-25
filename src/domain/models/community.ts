import { Types } from "mongoose";

export type UserType= 'Client' | 'vendor'

export interface ICommunity {
  _id?: Types.ObjectId;
  category : Types.ObjectId;
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


export interface ICommunityPost {
  _id ?: Types.ObjectId;
  communityId: Types.ObjectId;
  userId: Types.ObjectId;
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

  createdAt ?: string;
  updatedAt ?: string;
}

export interface ICommunityMember {
  _id?: Types.ObjectId;
  communityId: Types.ObjectId;
  userId: Types.ObjectId;
  userType : UserType 
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IComment {
  _id?: Types.ObjectId;
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  userType : UserType
  content: string;
  likesCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILike {
  _id?: Types.ObjectId;
  userId : Types.ObjectId;
  postId : Types.ObjectId;
  userType : UserType;
  createdAt ?: string;
  updatedAt ?: string;
}