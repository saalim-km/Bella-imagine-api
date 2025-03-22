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
        capped : {size: 1048576, max: 6}
    }
)