import mongoose from "mongoose";

export const notificationSchema = new mongoose.Schema(
    {
        message : {
            type : String,
            required : true
        },
        receiverId : {
            type : mongoose.Types.ObjectId,
            required : true
        },
        isRead : {
            type : Boolean,
            default : false
        }
    }
    ,{
        timestamps : true,
    }
)

notificationSchema.index({ createdAt : 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 }) // 30 days expiration