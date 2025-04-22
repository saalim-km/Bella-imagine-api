import mongoose, { Document, ObjectId } from "mongoose";
import { IMessageEntity } from "../../../entities/models/message.entity";
import { MessageSchema } from "../schemas/message.schema";

export interface IMessageModel extends Omit<IMessageEntity , "_id"> , Document {
    _id: ObjectId
}


export const MessageModel = mongoose.model<IMessageModel>('Message',MessageSchema)