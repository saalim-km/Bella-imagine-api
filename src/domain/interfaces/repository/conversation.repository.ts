import { IConversation } from "../../models/chat";
import { IncrementUnreadCount } from "../../types/chat.types";
import { IBaseRepository } from "./base.repository";
import { FindUsersForChat } from "./booking.repository";

export interface IConversationRepository extends IBaseRepository<IConversation> {
    incrementUnreadCount(input : IncrementUnreadCount) : Promise<void>
    findConersations(input : FindUsersForChat) : Promise<IConversation[]>
}