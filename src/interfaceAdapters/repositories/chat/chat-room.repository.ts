// frameworks/database/repositories/chat-room.repository.ts
import { injectable } from "tsyringe";
import { IChatRoomRepository } from "../../../entities/repositoryInterfaces/chat/chat-room-repository.interface";
import {
  ChatRoomModel,
  IChatRoomModel,
} from "../../../frameworks/database/models/chat-room.model";
import { CustomError } from "../../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IChatRoomEntity } from "../../../entities/models/chat-room";

@injectable()
export class ChatRoomRepository implements IChatRoomRepository {
  async findById(id: any): Promise<IChatRoomEntity | null> {
    try {
      return await ChatRoomModel.findById(id).exec();
    } catch (error) {
      console.error(`Error finding chat room by ID ${id}:`, error);
      throw new Error("Failed to find chat room by ID");
    }
  }

  async findByClientId(clientId: any): Promise<IChatRoomEntity[]> {
    try {
      return await ChatRoomModel.find({ clientId }).exec();
    } catch (error) {
      console.error(
        `Error finding chat rooms by client ID ${clientId}:`,
        error
      );
      throw new Error("Failed to find chat rooms by client ID");
    }
  }

  async findByVendorId(vendorId: any): Promise<IChatRoomEntity[]> {
    try {
      return await ChatRoomModel.find({ vendorId }).exec();
    } catch (error) {
      console.error(
        `Error finding chat rooms by vendor ID ${vendorId}:`,
        error
      );
      throw new Error("Failed to find chat rooms by vendor ID");
    }
  }

  async findOrCreate(
    clientId: string,
    vendorId: string,
    bookingId: string,
    lastMessage: {
      content: string;
      senderId?: string;
      senderType?: "Client" | "Vendor";
      createdAt: Date;
    }
  ): Promise<IChatRoomEntity> {
    try {
      let chatRoom = await ChatRoomModel.findOne({
        clientId,
        vendorId,
        bookingId, // Include bookingId in the query to ensure uniqueness
      }).exec();

      if (!chatRoom) {
        chatRoom = await ChatRoomModel.create({
          clientId,
          vendorId,
          bookingId,
          lastMessage: {
            content: lastMessage.content,
            senderId: lastMessage.senderId,
            senderType: lastMessage.senderType,
            createdAt: lastMessage.createdAt,
          },
          unreadCountClient: lastMessage.senderType === "Vendor" ? 1 : 0, // Increment for client if vendor sent
          unreadCountVendor: lastMessage.senderType === "Client" ? 1 : 0, // Increment for vendor if client sent
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      return chatRoom;
    } catch (error) {
      console.error("Error in findOrCreate chat room:", error);
      throw new Error("Failed to find or create chat room");
    }
  }

  async updateLastMessage(
    chatRoomId: string,
    content: string,
    senderId: string,
    senderType: "Client" | "Vendor",
    createdAt: Date
  ): Promise<void> {
    try {
      await ChatRoomModel.updateOne(
        { _id: chatRoomId },
        {
          $set: {
            lastMessage: {
              content,
              senderId,
              senderType,
              createdAt,
            },
            updatedAt: new Date(),
          },
        }
      ).exec();
    } catch (error) {
      console.error(
        `Error updating last message for chat room ${chatRoomId}:`,
        error
      );
      throw new Error("Failed to update last message");
    }
  }

  async incrementUnreadCount(
    chatRoomId: string,
    recipientType: "client" | "vendor"
  ): Promise<void> {
    try {
      const field =
        recipientType === "client" ? "unreadCountClient" : "unreadCountVendor";
      await ChatRoomModel.updateOne(
        { _id: chatRoomId },
        { $inc: { [field]: 1 } }
      ).exec();
    } catch (error) {
      console.error(
        `Error incrementing unread count for ${recipientType} in chat room ${chatRoomId}:`,
        error
      );
      throw new Error("Failed to increment unread count");
    }
  }

  async create(data: {
    clientId: any;
    vendorId: any;
    bookingId: any;
  }): Promise<IChatRoomModel> {
    try {
      const chatRoom = new ChatRoomModel({
        clientId: data.clientId,
        vendorId: data.vendorId,
        bookingId: data.bookingId,
        unreadCountClient: 0,
        unreadCountVendor: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const savedChatRoom = await chatRoom.save();
      return savedChatRoom;
    } catch (error) {
      console.error("Error creating chat room:", error);
      throw new Error("Failed to create chat room");
    }
  }

  async findByClientAndVendorAndBooking(
    clientId: any,
    vendorId: any,
    bookingId: any
  ): Promise<IChatRoomModel | null> {
    try {
      return await ChatRoomModel.findOne({
        clientId,
        vendorId,
        bookingId,
      }).exec();
    } catch (error) {
      console.error(
        "Error finding chat room by client, vendor, and booking:",
        error
      );
      throw new Error("Failed to find chat room");
    }
  }

  async resetUnreadCount(
    chatRoomId: string,
    recipientType: "client" | "vendor"
  ): Promise<void> {
    try {
      const field =
        recipientType === "client" ? "unreadCountClient" : "unreadCountVendor";
      await ChatRoomModel.updateOne(
        { _id: chatRoomId },
        { $set: { [field]: 0 } }
      ).exec();
    } catch (error) {
      console.error(
        `Error resetting unread count for ${recipientType} in chat room ${chatRoomId}:`,
        error
      );
      throw new CustomError(
        'failed to reset',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
}
