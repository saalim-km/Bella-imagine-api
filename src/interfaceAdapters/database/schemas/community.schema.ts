import mongoose, { Schema } from "mongoose";
import { ICommunity } from "../../../domain/models/community";

const communitySchema = new Schema<ICommunity>({
    name: {
        type: String,
        required: true
    },
    slug : {
        type : String,
        required : true,
        unique : true
    },
    category : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "Category"
    },
    description: {
        type: String,
        required: true
    },
    rules: {
        type: [String],
    },
    coverImage: {
        type: String,
        default: null
    },
    iconImage: {
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


export const Community = mongoose.model<ICommunity>('Community',communitySchema)