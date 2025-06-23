import { Types } from "mongoose";

export interface ICommunityPost {
  _id ?: Types.ObjectId;
  communityId: Types.ObjectId;
  userId: Types.ObjectId;

  title: string;
  content: string;    
  media: string[];
  mediaType?: 'image' | 'video' | 'mixed' | 'text' | 'none';

  isEdited ?: boolean;

  likeCount : number;
  commentCount: number;
  tags: string[];
  likes : [Types.ObjectId];
  comments : [Types.ObjectId];

  createdAt ?: string;
  updatedAt ?: string;
}
