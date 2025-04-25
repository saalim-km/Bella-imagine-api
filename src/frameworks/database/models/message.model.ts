import { model, ObjectId , Document } from "mongoose";
import { IMessageEntity } from "../../../entities/models/message.entity";
import { messageSchema } from "../schemas/message.schema";

export interface IMessageModel extends Omit<IMessageEntity, "_id">,
    Document {
      _id : ObjectId
    }

export const MessageModel = model<IMessageModel>("Message", messageSchema);
