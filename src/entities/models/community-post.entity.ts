import { ObjectId } from "mongoose";

export interface ICommunityPostEntity {
    _id: string;
    communityId: string | ObjectId;
    userId : string | ObjectId;
    title: string;
    content: string;
    media?: string[];
    voteUpCount: number;
    voteDownCount: number;
    commentCount: number;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}