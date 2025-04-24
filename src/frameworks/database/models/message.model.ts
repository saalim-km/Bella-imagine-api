import { model, ObjectId } from "mongoose";
import { IMessageEntity } from "../../../entities/models/message.entity";
import { messageSchema } from "../schemas/message.schema";

export interface IMessageModel
  extends Omit<IMessageEntity, "_id" | "chatRoomId">,
    Document {
  _id: ObjectId;
  chatRoomId: ObjectId;
}

export const MessageModel = model<IMessageModel>("Message", messageSchema); 