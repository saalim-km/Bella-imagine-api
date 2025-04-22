import mongoose, { ObjectId } from "mongoose";
import { IConversationEntity } from "../../../entities/models/conversation.entity";
import { ConversationSchema } from "../schemas/conversation.schema";

export interface IConversationModel extends Omit<IConversationEntity , "_id"> , Document {
    _id : ObjectId
}

export const ConversationModel = mongoose.model<IConversationModel>("Conversation", ConversationSchema)