import { inject, injectable } from "tsyringe";
import { IChatUsecase } from "../../domain/interfaces/usecase/chat-usecase.interface";
import { IClientRepository } from "../../domain/interfaces/repository/client.repository";
import { IVendorRepository } from "../../domain/interfaces/repository/vendor.repository";
import { IConversationRepository } from "../../domain/interfaces/repository/conversation.repository";
import { IMessageRepository } from "../../domain/interfaces/repository/message.repository";
import { FindUsersForChat, IBookingRepository } from "../../domain/interfaces/repository/booking.repository";
import { IGetPresignedUrlUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { CreateConversationInput, UpdateLastSeenInput, UpdateOnlineStatusInput } from "../../domain/interfaces/usecase/types/chat.types";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";
import { IConversation, IMessage } from "../../domain/models/chat";
import { IClient } from "../../domain/models/client";
import { IVendor } from "../../domain/models/vendor";
import { Types } from "mongoose";


@injectable()
export class ChatUsecase implements IChatUsecase {
  constructor(
    @inject("IClientRepository") private _clientRepo: IClientRepository,
    @inject("IVendorRepository") private _vendorRepo: IVendorRepository,
    @inject("IConversationRepository")
    private _conversationRepo: IConversationRepository,
    @inject('IMessageRepository') private _messageRepo : IMessageRepository,
    @inject('IBookingRepository') private _bookingRepo : IBookingRepository,
    @inject('IGetPresignedUrlUsecase') private _pregisnedUrl : IGetPresignedUrlUsecase
  ) {}

  async updateOnlineStatus(input: UpdateOnlineStatusInput): Promise<void> {
    const { role, status, userId } = input;
    const strategies: Record<string, IClientRepository | IVendorRepository> = {
      client: this._clientRepo,
      vendor: this._vendorRepo,
    };

    const strategy = strategies[role];
    if (!strategy) {
      throw new CustomError(
        ERROR_MESSAGES.INVALID_ROLE,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await strategy.update(userId, { isOnline: status });
  }

  async updateLastSeen(input: UpdateLastSeenInput): Promise<void> {
    const { role, lastSeen, userId } = input;
    const strategies: Record<string, IClientRepository | IVendorRepository> = {
      client: this._clientRepo,
      vendor: this._vendorRepo,
    };

    const strategy = strategies[role];
    if (!strategy) {
      throw new CustomError(
        ERROR_MESSAGES.INVALID_ROLE,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await strategy.update(userId, { lastSeen: lastSeen });
  }

  async sendMessage(input: IMessage): Promise<IMessage> {

    const message: IMessage = {
      conversationId: input.conversationId,
      senderId: input.senderId,
      text: input.text || "",
      type: input.type,
      mediaKey: input.mediaKey || "",
      timestamp: new Date(),
      isDeleted: false,
      userType : input.userType,
    };

    const conversation = await this._conversationRepo.findById(
      input.conversationId
    );

    if (!conversation || !conversation._id) {
      throw new CustomError("no conversation found", HTTP_STATUS.NOT_FOUND);
    }

    conversation.lastMessage = message;
    const [newMessage] = await Promise.all([
        this._messageRepo.create(message),
        this._conversationRepo.update(conversation._id,{lastMessage : message}),
        this._conversationRepo.incrementUnreadCount({role : input.userType , conversationId : conversation._id})
    ])

    return newMessage
  }

  async fetchUsersForChat(input: FindUsersForChat): Promise<IClient[] | IVendor[]> {
    return await this._bookingRepo.findUsersForChat({userId : input.userId , userType : input.userType})
  }

  async fetchConversations(input: FindUsersForChat): Promise<IConversation[]> {
      return await this._conversationRepo.findConersations(input)
  }

  async fetchMessages(conversationId: Types.ObjectId): Promise<IMessage[]> {
      const messages = await this._messageRepo.getMessages(conversationId)
      
    const enrichedMessages = await Promise.all(
      messages.map(async (message) => {
        if (message.mediaKey) {
          let mediaUrl = await this._pregisnedUrl.getPresignedUrl(message.mediaKey);

          // Assign mediaUrl to mediaKey (optional: use a separate field if needed)
          message.mediaKey = mediaUrl;
        }

        return message;
      })
    );

    return enrichedMessages
  }

  async createConversation(input: CreateConversationInput): Promise<void> {
    const {bookingId,clientId,vendorId} = input;

    const [client, vendor] = await Promise.all([
      this._clientRepo.findById(clientId),
      this._vendorRepo.findById(vendorId)
    ]);

    if (!client || !vendor) {
      throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }



    await this._conversationRepo.create({
      bookingId : bookingId,
      client : {
        _id : clientId,
        avatar : client.profileImage,
        email : client.email,
        isOnline : client.isOnline,
        lastSeen : client.lastSeen.toDateString(),
        name: client.name,
        role : "client",
      },
      vendor : {
        _id: vendorId,
        avatar: vendor.profileImage,
        email: vendor.email,
        isOnline: vendor.isOnline,
        lastSeen: vendor.lastSeen.toDateString(),
        name: vendor.name,
        role: "vendor",
      },
    })
  }
}
