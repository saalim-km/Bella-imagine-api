import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { IMessage } from "../../domain/models/chat";
import { IMessageRepository } from "../../domain/interfaces/repository/message.repository";
import { Message } from "../database/schemas/message.schema";
import { Types } from "mongoose";

@injectable()
export class MessageRepository extends BaseRepository<IMessage> implements IMessageRepository {
    constructor(){
        super(Message)
    }

    async getMessages(conversationId: Types.ObjectId): Promise<IMessage[]> {
        return await this.model.find({conversationId : conversationId})
    }
}