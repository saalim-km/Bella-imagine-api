import mongoose from "mongoose";

export const notificationSchema = new mongoose.Schema(
    {
        message : {
            type : String,
            required : true
        },
        senderId : {
            type : mongoose.Types.ObjectId,
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
    ,{timestamps : true}
)