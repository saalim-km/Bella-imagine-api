import { TRole } from "../../../shared/constants";
import {
  IMessageEntity,
  LocationType,
  MessageType,
} from "../../models/message.entity";

// export interface SendMessageDTO {
//   conversationId: string;
//   senderId: string;
//   text: string;
//   type: MessageType;
//   file?: string;
//   location?: LocationType;
//   userType : TRole
// }


export interface ISendMessageUsecase {
  execute(dto : Partial<IMessageEntity>):  Promise<IMessageEntity>
}