import mongoose, { Schema, Types } from "mongoose";
import { ICommunityMember } from "../../../domain/models/community-member";

export const communityMember = new Schema<ICommunityMember>({
    communityId : {
        type : Schema.Types.ObjectId,
        ref : 'Community',
        required : true
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    postCount : {
        type : Number,
        default : 0
    },
},{timestamps : true})

export const CommunityMember = mongoose.model<ICommunityMember>('CommunityMember',communityMember)