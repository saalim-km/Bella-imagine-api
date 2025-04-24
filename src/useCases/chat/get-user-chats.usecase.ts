import { injectable, inject } from "tsyringe";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IChatRoomRepository } from "../../entities/repositoryInterfaces/chat/chat-room-repository.interface";
import { IClientModel } from "../../frameworks/database/models/client.model";
import { IBookingModel } from "../../frameworks/database/models/booking.model";
import { IChatRoomModel } from "../../frameworks/database/models/chat-room.model";
import { IVendorModel } from "../../frameworks/database/models/vendor.model";
import { IGetUserChatsUseCase } from "../../entities/usecaseInterfaces/chat/get-user-chats-usecase.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client-repository.interface";

@injectable()
export class GetUserChatsUseCase implements IGetUserChatsUseCase {
  constructor(
    @inject("IBookingRepository") private bookingRepository: IBookingRepository,
    @inject("IVendorRepository") private vendorRepository: IVendorRepository,
    @inject("IChatRoomRepository")
    private chatRoomRepository: IChatRoomRepository,
    @inject("IClientRepository") private clientRepository: IClientRepository
  ) {}

  async execute(userId: any, userType: "Client" | "Vendor"): Promise<any[]> {
    try {
      if (userType === "Client") {
        // Step 1: Fetch all bookings for this client
        const bookings: IBookingModel[] =
          await this.bookingRepository.findByClientId(userId);
        console.log(
          "Bookings:",
          bookings.map((b) => ({ vendorId: b.vendorId }))
        );

        // Step 2: Filter bookings to only confirmed or completed ones
        const validBookings = bookings;

        // If no valid bookings, return empty array (no chats)
        if (validBookings.length === 0) {
          return [];
        }

        // Step 3: Create or fetch chat rooms for each valid booking
        const chatRooms: IChatRoomModel[] = await Promise.all(
          validBookings.map(async (booking) => {
            // Extract vendorId, handling populated objects and undefined cases
            const vendorId = booking.vendorId
              ? typeof booking.vendorId === "object" &&
                "_id" in booking.vendorId
                ? (booking.vendorId as any)._id.toString() // Populated Vendor object
                : booking.vendorId.toString() // ObjectId or string
              : null;

            console.log("Extracted vendorId:", vendorId); // Debug the extracted value

            // Extract bookingId, handling undefined case
            const bookingId = booking._id
              ? booking._id.toString()
              : (() => {
                  console.error("Missing _id in booking:", booking);
                  throw new Error("Booking is missing _id");
                })();

            // Check if a chat room already exists
            let chatRoom =
              await this.chatRoomRepository.findByClientAndVendorAndBooking(
                userId,
                vendorId,
                bookingId
              );

            // If no chat room exists, create one
            if (!chatRoom) {
              chatRoom = await this.chatRoomRepository.create({
                clientId: userId,
                vendorId,
                bookingId,
              });
            }

            return chatRoom;
          })
        );
        console.log(
          "ChatRooms:",
          chatRooms.map((cr) => ({ vendorId: cr.vendorId }))
        );

        // Step 4: Fetch vendor details for all chat rooms
        const vendorIds = [
          ...new Set(
            chatRooms.map((chatRoom) => {
              const vendorIdStr = chatRoom.vendorId.toString();
              if (!/^[0-9a-fA-F]{24}$/.test(vendorIdStr)) {
                console.error(
                  "Invalid vendorId in chatRoom:",
                  chatRoom.vendorId
                );
                throw new Error(
                  `Invalid vendorId ${chatRoom.vendorId} in chatRoom ${chatRoom._id}`
                );
              }
              return vendorIdStr;
            })
          ),
        ];
        console.log("VendorIds:", vendorIds);
        const vendors: IVendorModel[] = await this.vendorRepository.findByIds(
          vendorIds
        );

        // Step 5: Map chat rooms to frontend-friendly format
        const chatList = chatRooms
          .map((chatRoom) => {
            const vendor = vendors.find(
              (v) => v._id.toString() === chatRoom.vendorId.toString()
            );
            if (!vendor) {
              console.warn(`Vendor not found for ID: ${chatRoom.vendorId}`);
              return null; // Skip if vendor not found (shouldn’t happen with proper data)
            }

            return {
              chatRoomId: chatRoom._id.toString(),
              recipientId: vendor._id.toString(),
              recipientName: `${vendor.name}`.trim(),
              recipientAvatar: vendor.profileImage || undefined,
              lastMessage: chatRoom.lastMessage?.content,
              lastMessageTime: chatRoom.lastMessage?.createdAt,
              unreadCount: chatRoom.unreadCountClient || 0,
              recipientStatus: vendor.onlineStatus || "offline",
            };
          })
          .filter(Boolean); // Remove null entries

        return chatList;
      } else if (userType === "Vendor") {
        // [Vendor branch unchanged]
        const bookings: IBookingModel[] =
          await this.bookingRepository.findByVendorId(userId);
        const validBookings = bookings.filter((b) =>
          ["confirmed", "completed"].includes(b.status)
        );
        if (validBookings.length === 0) {
          return [];
        }
        const chatRooms: IChatRoomModel[] = await Promise.all(
          validBookings.map(async (booking) => {
            const clientId = booking.userId;
            const bookingId = booking._id
              ? booking._id.toString()
              : (() => {
                  console.error("Missing _id in booking:", booking);
                  throw new Error("Booking is missing _id");
                })();
            let chatRoom =
              await this.chatRoomRepository.findByClientAndVendorAndBooking(
                clientId,
                userId,
                bookingId
              );
            if (!chatRoom) {
              chatRoom = await this.chatRoomRepository.create({
                clientId,
                vendorId: userId,
                bookingId,
              });
            }

            return chatRoom;
          })
        );
        const clientIds = [
          ...new Set(chatRooms.map((chatRoom) => chatRoom.clientId.toString())),
        ];
        const clients: IClientModel[] = await this.clientRepository.findByIds(
          clientIds
        );
        const chatList = chatRooms
          .map((chatRoom) => {
            const client = clients.find(
              (c) => c._id.toString() === chatRoom.clientId.toString()
            );
            if (!client) {
              console.warn(`Client not found for ID: ${chatRoom.clientId}`);
              return null;
            }
            return {
              chatRoomId: chatRoom._id.toString(),
              recipientId: client._id.toString(),
              recipientName: `${client.name}`.trim(),
              recipientAvatar: client.profileImage || undefined,
              lastMessage: chatRoom.lastMessage?.content,
              lastMessageTime: chatRoom.lastMessage?.createdAt,
              unreadCount: chatRoom.unreadCountVendor || 0,
              recipientStatus: client.onlineStatus || "offline",
            };
          })
          .filter(Boolean);
          console.log('chat list : ',chatList);
        return chatList;
      } else {
        throw new Error("Invalid userType. Must be 'Client' or 'Vendor'");
      }
    } catch (error) {
      console.error(
        `Error in GetUserChatsUseCase for user ${userId} (${userType}):`,
        error
      );
      throw new Error("Failed to fetch user chats");
    }
  }
}
