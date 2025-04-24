import { inject, injectable } from "tsyringe";
import { IChatController } from "../../../entities/controllerInterfaces/chat/chat-controller.interface";
import { Server as SocketIOServer, Socket } from "socket.io";
import { Server } from "http";
import cookie from "cookie";
import { Request, Response } from "express";
import { config } from "../../../shared/config";
import { IVendorRepository } from "../../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IMessageRepository } from "../../../entities/repositoryInterfaces/chat/message-repository.interface";
import { IChatRoomRepository } from "../../../entities/repositoryInterfaces/chat/chat-room-repository.interface";
import { CustomError } from "../../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IJwtservice } from "../../../entities/services/jwt.service";
import { IClientRepository } from "../../../entities/repositoryInterfaces/client/client-repository.interface";
import { ISendMessageUseCase } from "../../../entities/usecaseInterfaces/chat/send-message-usecase.interface";
import { IGetChatHistoryUseCase } from "../../../entities/usecaseInterfaces/chat/get-chat-history-usecase.interface";
import { IGetUserChatsUseCase } from "../../../entities/usecaseInterfaces/chat/get-user-chats-usecase.interface";
import { IMarkMessagesAsReadUseCase } from "../../../entities/usecaseInterfaces/chat/mark-messages-as-read-usecase.inteface";

// Define interfaces for socket event payloads
interface JoinEvent {
  userId: string;
  userType: "Client" | "Vendor";
}

interface SendMessageEvent {
  chatRoomId: string;
  senderId: string;
  senderType: "Client" | "Vendor";
  content: string;
}

interface MessageReadEvent {
  chatRoomId: string;
  userId: string;
  userType: "Client" | "Vendor";
}

interface GetChatHistoryEvent {
  chatRoomId: string;
}

@injectable()
export class ChatController implements IChatController {
  public io?: SocketIOServer;

  constructor(
    @inject("IClientRepository") private clientRepository: IClientRepository,
    @inject("IVendorRepository") private vendorRepository: IVendorRepository,
    @inject("ISendMessageUseCase")
    private sendMessageUseCase: ISendMessageUseCase,
    @inject("IGetChatHistoryUseCase")
    private getChatHistoryUseCase: IGetChatHistoryUseCase,
    @inject("IGetUserChatsUseCase")
    private getUserChatsUseCase: IGetUserChatsUseCase,
    @inject("IMarkMessagesAsReadUseCase")
    private markMessagesAsReadUseCase: IMarkMessagesAsReadUseCase,
    @inject("IMessageRepository") private messageRepository: IMessageRepository,
    @inject("IChatRoomRepository")
    private chatRoomRepository: IChatRoomRepository,
    @inject("IJwtservice") private tokenService: IJwtservice
  ) {}

  initialize(server: Server): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: config.cors.ALLOWED_ORIGIN,
        methods: ["GET", "POST"],
        credentials: true,
      },
      path: '/api/v_1/_chat', // Use config for socket path
    });

    // // Add Socket.IO middleware for authentication
    // this.io.use((socket: Socket, next) => {
    //   const cookies = cookie.parse(socket.request.headers.cookie || "");

    //   const tokenNames = [
    //     "admin_access_token",
    //     "client_access_token",
    //     "vendor_access_token",
    //   ];

    //   let token: string | undefined;
    //   for (const tokenName of tokenNames) {
    //     if (cookies[tokenName]) {
    //       token = cookies[tokenName];
    //       break;
    //     }
    //   }

    //   if (!token) {
    //     return next(new CustomError("No token provided", HTTP_STATUS.UNAUTHORIZED));
    //   }

    //   const decoded = this.tokenService.verifyAccessToken(token);
    //   if (!decoded) {
    //     return next(new CustomError(ERROR_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED));
    //   }

    //   socket.data.user = {
    //     _id: decoded.id as string,
    //     email: decoded.email as string,
    //     role: decoded.role as string,
    //   };
    //   next();
    // });

    this.initializeSocketEvents();
  }

  initializeSocketEvents(): void {
    if (!this.io) throw new Error("Socket.IO not initialized");

    this.io.on("connection", (socket: Socket) => {
      console.log("User connected:", socket.id);

      socket.on("join", async ({ userId, userType }: JoinEvent, callback) => {
        try {
          if (!userId || !["Client", "Vendor"].includes(userType)) {
            throw new CustomError("Invalid userId or userType", HTTP_STATUS.BAD_REQUEST);
          }

          socket.data.userId = userId;
          socket.data.userType = userType;
          socket.join(userId);

          if (userType === "Client") {
            await this.clientRepository.findByIdAndUpdateOnlineStatus(userId, "online");
          } else {
            await this.vendorRepository.findByIdAndUpdateOnlineStatus(userId, "online");
          }

          socket.broadcast.emit("userStatus", {
            userId,
            userType,
            status: "online",
          });

          callback?.({ success: true });
        } catch (error) {
          console.error("Error in join event:", error);
          socket.emit("error", { message: "Failed to join" });
          callback?.({ success: false, error: (error as Error).message });
        }
      });

      socket.on("messageRead", async ({ chatRoomId, userId, userType }: MessageReadEvent) => {
        try {
          if (!chatRoomId || !userId || !["Client", "Vendor"].includes(userType)) {
            throw new CustomError("Invalid input", HTTP_STATUS.BAD_REQUEST);
          }

          await this.markMessagesAsReadUseCase.execute(chatRoomId, userId, userType);
          const [messages, chatRoom] = await Promise.all([
            this.messageRepository.findByChatRoomId(chatRoomId),
            this.chatRoomRepository.findById(chatRoomId),
          ]);

          if (!chatRoom) throw new CustomError("Chat room not found", HTTP_STATUS.NOT_FOUND);

          const recipientId = userType === "Client" ? chatRoom.vendorId : chatRoom.clientId;
          this.io
            ?.to(userId)
            .to(recipientId.toString())
            .emit("messagesUpdated", messages);
          this.io
            ?.to(userId)
            .to(recipientId.toString())
            .emit("chatUpdate", { chatRoomId, lastMessage: messages[messages.length - 1] });
        } catch (error) {
          console.error("Error marking messages as read:", error);
          socket.emit("error", { message: "Failed to mark messages as read" });
        }
      });

      socket.on("getUserChats", async ({ userId, userType }: JoinEvent) => {
        try {
          console.log('in getuserchats socket events !!');
          if (!userId || !["Client", "Vendor"].includes(userType)) {
            throw new CustomError("Invalid userId or userType", HTTP_STATUS.BAD_REQUEST);
          }

          const chatRooms = await this.getUserChatsUseCase.execute(userId, userType);
          console.log('got the chatroomss : ',chatRooms);
          socket.emit("userChats", chatRooms);
        } catch (error) {
          console.error("Error fetching user chats:", error);
          socket.emit("error", { message: "Failed to fetch chats" });
        }
      });

      socket.on("sendMessage", async ({ chatRoomId, senderId, senderType, content }: SendMessageEvent) => {
        try {
          if (!chatRoomId || !senderId || !["Client", "Vendor"].includes(senderType) || !content) {
            throw new CustomError("Invalid input", HTTP_STATUS.BAD_REQUEST);
          }

          const chatRoom = await this.chatRoomRepository.findById(chatRoomId);
          if (!chatRoom) throw new CustomError("Chat room not found", HTTP_STATUS.NOT_FOUND);

          const message = await this.sendMessageUseCase.execute(
            senderType === "Client" ? senderId : chatRoom.clientId.toString(),
            senderType === "Vendor" ? senderId : chatRoom.vendorId.toString(),
            senderId,
            senderType,
            content,
            chatRoomId
          );

          this.io
            ?.to(chatRoom.clientId.toString())
            .to(chatRoom.vendorId.toString())
            .emit("message", message);
          this.io
            ?.to(chatRoom.clientId.toString())
            .to(chatRoom.vendorId.toString())
            .emit("chatUpdate", { chatRoomId, lastMessage: message });
        } catch (error) {
          console.error("Error sending message:", error);
          socket.emit("error", { message: "Failed to send message" });
        }
      });

      socket.on("getChatHistory", async ({ chatRoomId }: GetChatHistoryEvent) => {
        try {
          if (!chatRoomId) {
            throw new CustomError("Invalid chatRoomId", HTTP_STATUS.BAD_REQUEST);
          }

          const messages = await this.getChatHistoryUseCase.execute(chatRoomId);
          socket.emit("chatHistory", messages);
        } catch (error) {
          console.error("Error fetching chat history:", error);
          socket.emit("error", { message: "Failed to fetch chat history" });
        }
      });

      socket.on("disconnect", async () => {
        try {
          const { userId, userType } = socket.data;
          if (userId && userType) {
            if (userType === "Client") {
              await this.clientRepository.findByIdAndUpdateOnlineStatus(userId, "offline");
              socket.broadcast.emit("userStatus", {
                userId,
                userType: "Client",
                status: "offline",
              });
            } else if (userType === "Vendor") {
              await this.vendorRepository.findByIdAndUpdateOnlineStatus(userId, "offline");
              socket.broadcast.emit("userStatus", {
                userId,
                userType: "Vendor",
                status: "offline",
              });
            }
          }
          console.log("User disconnected:", socket.id);
        } catch (error) {
          console.error("Error handling disconnect:", error);
        }
      });
    });
  }

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { userId, userType } = req.params;
      if (!userId || !["Client", "Vendor"].includes(userType)) {
        throw new CustomError("Invalid userId or userType", HTTP_STATUS.BAD_REQUEST);
      }

      const chatRooms = await this.getUserChatsUseCase.execute(userId, userType as "Client" | "Vendor");
      res.status(200).json(chatRooms);
    } catch (error) {
      console.error("Error fetching user chats:", error);
      res.status(500).json({ error: "Failed to fetch chats" });
    }
  }
}