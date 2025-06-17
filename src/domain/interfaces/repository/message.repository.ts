import { Types } from "mongoose";
import { IMessage } from "../../models/chat";
import { IBaseRepository } from "./base.repository";

export interface IMessageRepository extends IBaseRepository<IMessage> {
    getMessages(conversationId : Types.ObjectId) : Promise<IMessage[]>
}