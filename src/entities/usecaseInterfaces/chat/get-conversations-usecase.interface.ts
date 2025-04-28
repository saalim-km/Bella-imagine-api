import { TRole } from "../../../shared/constants";
import { IConversationEntity } from "../../models/conversation.entity";

export interface IGetConversationsUsecase {
    execute(userId : string , userType : TRole) : Promise<IConversationEntity[]>
}