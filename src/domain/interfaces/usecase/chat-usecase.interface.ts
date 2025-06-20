import { Types } from "mongoose";
import { IConversation, IMessage } from "../../models/chat";
import { IClient } from "../../models/client";
import { IVendor } from "../../models/vendor";
import { FindUsersForChat } from "../repository/booking.repository";
import { CreateConversationInput, UpdateLastSeenInput, UpdateOnlineStatusInput, UploadMediaInput, UploadMediaOutput } from "./types/chat.types";

export interface IChatUsecase {
    updateOnlineStatus(input : UpdateOnlineStatusInput) : Promise<void>
    updateLastSeen(input : UpdateLastSeenInput) : Promise<void>
    sendMessage(input : IMessage) : Promise<IMessage>
    fetchUsersForChat(input : FindUsersForChat) : Promise<IClient[] | IVendor[]>
    fetchConversations(input : FindUsersForChat) : Promise<IConversation[]>
    fetchMessages(conversationId : Types.ObjectId) : Promise<IMessage[]>
    createConversation(input : CreateConversationInput) : Promise<void>
    uploadMedia(input : UploadMediaInput) : Promise<UploadMediaOutput>
}