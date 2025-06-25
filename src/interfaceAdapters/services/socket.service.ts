import { inject, injectable } from "tsyringe";
import { Server as SocketIoServer } from "socket.io";
import { ISocketService } from "../../domain/interfaces/service/socket-service.interface";
import { Server } from "http";
import { IChatUsecase } from "../../domain/interfaces/usecase/chat-usecase.interface";
import { IMessage } from "../../domain/models/chat";
import { INotificationUsecase } from "../../domain/interfaces/usecase/notification-usecase.interface";
import { objectIdSchema } from "../../shared/utils/zod-validations/validators/validations";
import logger from "../../shared/logger/logger";
import { ICommunityPostCommandUsecase } from "../../domain/interfaces/usecase/community-usecase.interface";

@injectable()
export class SocketService implements ISocketService {
  public io?: SocketIoServer;

  constructor(
    @inject("IChatUsecase") private _chatUsecase: IChatUsecase,
    @inject("INotificationUsecase")
    private _notificationUsecase: INotificationUsecase,
    @inject("ICommunityPostCommandUsecase")
    private _communityPostUsecase: ICommunityPostCommandUsecase
  ) {}

  initialize(server: Server): void {
    (this.io = new SocketIoServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
      path: "/path/_chat",
      transports: ["websocket", "polling"],
    })),
      this.io.use(async (socket, next) => {
        const { userId, userType } = socket.handshake.auth;
        socket.data = { userId, userType };
        next();
      });
    this.initializeSocketEvents();
  }

  initializeSocketEvents(): void {
    if (!this.io) return;

    console.log("socketio events initialized ❤️");

    this.io.on("connection", async (socket) => {
      console.log("socket data from frontend : ", socket.data);
      const { userId, userType } = socket.data;
      console.log(`User Connected ✅ userId => ${userId} role => ${userType}`);

      // connection event
      socket.on("join", async ({ userId, userType }) => {
        console.log("join event triggered 😘", userId, userType);
        socket.join(userId);
        await this._chatUsecase.updateOnlineStatus({
          userId: userId,
          role: userType,
          status: true,
        });
        socket.broadcast.emit("user_status", {
          userId,
          userType,
          status: true,
        });
      });

      // disconnect event
      socket.on("disconnect", async () => {
        console.log("user disconnected ❌ triggered", userId, userType);

        const lastSeen = new Date().toString();
        await this._chatUsecase.updateOnlineStatus({
          userId: userId,
          role: userType,
          status: false,
        });
        socket.broadcast.emit("user_status", {
          userId,
          userType,
          status: false,
        });

        await this._chatUsecase.updateLastSeen({
          userId: userId,
          lastSeen: lastSeen,
          role: userType,
        });
        socket.broadcast.emit("update_lastseen", { userId, lastSeen });
      });

      // send message event
      socket.on(
        "send_message",
        async ({
          message,
          recipentId,
          recipentName,
        }: {
          message: IMessage;
          recipentId: string;
          recipentName: string;
        }) => {
          try {
            console.log("send_message trigger ✅💀");
            console.log("new message", message, recipentId, recipentName);

            const newMessage = await this._chatUsecase.sendMessage(message);
            this.io?.to(recipentId.toString()).emit("new_message", newMessage);
            this.io
              ?.to(message.senderId.toString())
              .emit("new_message", newMessage);
            const newNotification =
              await this._notificationUsecase.createNotification({
                message: `${recipentName} send you a message`,
                receiverId: objectIdSchema.parse(recipentId),
                senderId: objectIdSchema.parse(message.senderId),
                receiverModel: userType === "client" ? "Vendor" : "Client",
                senderModel: userType === "client" ? "Client" : "Vendor",
                type: "chat",
              });
            console.log("new notification created : ", newNotification);
            this.io
              ?.to(recipentId.toString())
              .emit("new_message_notification", newNotification);
          } catch (error) {
            console.log(error);
          }
        }
      );

      // get contacts event
      socket.on("get_contacts", async ({ userId, userType }) => {
        try {
          const contacts = await this._chatUsecase.fetchUsersForChat({
            userId: userId,
            userType: userType,
          });
          socket.emit("contacts", contacts);
        } catch (error) {
          console.log(error);
        }
      });

      // get conversations event
      socket.on("get_conversations", async ({ userId, userType }) => {
        try {
          const conversations = await this._chatUsecase.fetchConversations({
            userId: userId,
            userType: userType,
          });
          socket.emit("conversations", conversations);
        } catch (error) {
          console.log(error);
        }
      });

      // get message event
      socket.on("get_messages", async ({ conversationId }) => {
        try {
          const messages = await this._chatUsecase.fetchMessages(
            conversationId
          );
          socket.emit("messages", messages);
        } catch (error) {
          console.log(error);
        }
      });

      socket.on("new_booking", async ({ receiverId }) => {
        const newNotification =
          await this._notificationUsecase.createNotification({
            message: "New Booking Scheduled",
            receiverId: receiverId,
            senderId: userId,
            receiverModel: "Vendor",
            senderModel: "Client",
            type: "booking",
          });
        console.log(
          "new notificaion for booking is beign created : ",
          newNotification
        );
        this?.io
          ?.to(receiverId)
          .emit("new_message_notification", newNotification);
      });

      socket.on("like_post", async ({ postId }) => {
        logger.info("Like post trigger 🤞");
        console.log(postId, userId);

        try {
          const { success } = await this._communityPostUsecase.likePost({
            postId: postId,
            userId: userId,
            role: userType,
          });

          socket.emit("like_confirm", {
            success: success,
            postId: postId,
            action: "like",
          });
        } catch (error) {
          logger.error("Error in like_post handler:", error);
          socket.emit("like_confirm", {
            success: false,
            postId: postId,
            action: "like",
            error: "Failed to like post",
          });
        }
      });

      socket.on("unLike_post", async ({ postId }) => {
        logger.info("Unlike post trigger ✅");
        console.log(postId, userId);

        try {
          const { success } = await this._communityPostUsecase.unLikePost({
            postId: postId,
            userId: userId,
            role: userType,
          });

          socket.emit("like_confirm", {
            success: success,
            postId: postId,
            action: "unlike",
          });
        } catch (error) {
          logger.error("Error in unLike_post handler:", error);
          socket.emit("like_confirm", {
            success: false,
            postId: postId,
            action: "unlike",
            error: "Failed to unlike post",
          });
        }
      });
    });
  }
}
