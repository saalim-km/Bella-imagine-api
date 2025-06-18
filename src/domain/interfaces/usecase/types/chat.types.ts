import { Types } from "mongoose";
import { TRole } from "../../../../shared/constants/constants";

export interface BaseUserInput {
  userId: Types.ObjectId;
  role: TRole;
}
export interface UpdateOnlineStatusInput extends BaseUserInput {
  status: boolean;
}

export interface UpdateLastSeenInput extends BaseUserInput {
  lastSeen: string;
}

export interface CreateConversationInput {
  clientId: Types.ObjectId;
  vendorId: Types.ObjectId;
  bookingId: Types.ObjectId;
}

export interface UploadMediaInput {
  media: Express.Multer.File;
  conversationId: string;
}

export interface UploadMediaOutput {
  key: string;
  mediaUrl: string;
}
