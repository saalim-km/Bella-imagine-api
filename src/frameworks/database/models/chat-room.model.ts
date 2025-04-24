import { model, ObjectId } from "mongoose";
import { chatRoomSchema } from "../schemas/chat-room.schema";
import { IChatRoomEntity } from "../../../entities/models/chat-room";

export interface IChatRoomModel
  extends Omit<IChatRoomEntity, "_id" | "clientId" | "vendorId" | "bookingId">,
    Document {
  _id: ObjectId;
  clientId: ObjectId;
  vendorId: ObjectId;
  bookingId: ObjectId;
}

export const ChatRoomModel = model<IChatRoomModel>("ChatRoom", chatRoomSchema);
