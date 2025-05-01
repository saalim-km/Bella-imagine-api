import mongoose, { Schema, Types } from "mongoose";
import { ICommunityMemberEntity } from "../../../entities/models/community-members.entity";

export const communityMemberSchema = new Schema<ICommunityMemberEntity>({
    communityId : {
        type : Types.ObjectId,
        ref : 'Community',
        required : true
    },
    userId : {
        type : Types.ObjectId,
        ref : 'User',
        required : true
    },
    postCount : {
        type : Number,
        default : 0
    },
},{timestamps : true})

export const CommunityMemberModel = mongoose.model<ICommunityMemberEntity>('CommunityMember',communityMemberSchema)