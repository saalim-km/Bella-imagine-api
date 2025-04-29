import mongoose, { Schema } from "mongoose";
import { ICommunityEntity } from "../../../entities/models/community.entity";

const communitySchema = new Schema<ICommunityEntity>({
    name: {
        type: String,
        required: true
    },
    slug : {
        type : String,
        required : true,
        unique : true
    },
    description: {
        type: String,
        required: true
    },
    rules: {
        type: [String],
    },
    coverImageUrl: {
        type: String,
        default: null
    },
    iconImageUrl: {
        type: String,
        default: null
    },
    isPrivate: {
        type: Boolean,
        default : true
    },
    isFeatured: {
        type: Boolean,
        default : false
    },
    memberCount: {
        type: Number,
        default: 0
    },
    postCount: {
        type: Number,
        default: 0
    },
},{timestamps : true});


export const CommunityModel = mongoose.model<ICommunityEntity>('Community',communitySchema)