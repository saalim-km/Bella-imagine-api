import { model, Schema } from "mongoose";
import { ILike } from "../../../domain/models/community";

const likeSchema = new Schema<ILike>({
    postId : {
        type : Schema.Types.ObjectId,
        ref : 'CommunityPost',
        required : true
    },
    userId : {
        type : Schema.Types.ObjectId,
        refPath : 'userType',
        required : true
    },
    userType : {
        type : String,
        required : true,
        enum : ['Client' ,'Vendor']
    },
})

export const Like = model('likes',likeSchema)