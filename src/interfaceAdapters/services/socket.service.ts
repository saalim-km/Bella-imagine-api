import { inject, injectable } from "tsyringe";
import { Server as SocketIoServer } from "socket.io";
import { ISocketService } from "../../domain/interfaces/service/socket-service.interface";
import { Server } from "http";
import { IChatUsecase } from "../../domain/interfaces/usecase/chat-usecase.interface";
import { IMessage } from "../../domain/models/chat";

@injectable()
export class SocketService implements ISocketService {
  public io?: SocketIoServer;

  constructor(@inject("IChatUsecase") private _chatUsecase: IChatUsecase) {}

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
      console.log('socket data from frontend : ',socket.data);
      const { userId, userType } = socket.data;
      console.log(`User Connected ✅ userId => ${userId} role => ${userType}`);

      // connection event
      socket.on("join", async ({ userId, userType }) => {
        console.log("join event triggered 😘", userId,userType);
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
        console.log("user disconnected ❌ triggered", userId,userType);

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
            const newMessage = await this._chatUsecase.sendMessage(message);
            this.io?.to(recipentId.toString()).emit("new_message", newMessage);
            this.io
              ?.to(message.senderId.toString())
              .emit("new_message", newMessage);
            // const newNotification =
            //   // await this.notificationUsecase.sendNotification({
            //   //   message: `${recipentName} send a message`,
            //   //   receiverId: recipentId,
            //   // });
            // this.io
            //   ?.to(recipentId.toString())
            //   .emit("new_message_notification", newNotification);
          } catch (error) {
            console.log(error);
          }
        }
      );

      // get contacts event
      socket.on("get_contacts", async ({ userId, userType }) => {
        try {
          console.log("getcontacts triggered 😘");
          const contacts = await this._chatUsecase.fetchUsersForChat({
            userId: userId,
            userType: userType,
          });
          console.log("got contacts", contacts);
          socket.emit("contacts", contacts);
        } catch (error) {
          console.log(error);
        }
      });

      // get conversations event
      socket.on("get_conversations", async ({ userId, userType }) => {
        try {
          console.log("get_conversations triggered");
          console.log(userId, userType);
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
          console.log("fetch message event trigger ✅", conversationId);
          const messages = await this._chatUsecase.fetchMessages(
            conversationId
          );
          console.log("user messages : ", messages);
          socket.emit("messages", messages);
        } catch (error) {
          console.log(error);
        }
      });
    });
  }
}
