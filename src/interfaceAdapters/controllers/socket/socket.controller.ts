import { inject, injectable } from "tsyringe";
import { ISocketController } from "../../../entities/controllerInterfaces/chat/socket-controller.interface";
import { Socket, Server as SocketServer } from "socket.io";
import { IMessageUsecase } from "../../../entities/usecaseInterfaces/chat/message-usecase.interface";
import { IConversationUsecase } from "../../../entities/usecaseInterfaces/chat/conversation-usecase.interface";
import { IncomingMessage, Server } from "http";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { CustomError } from "../../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IJwtservice } from "../../../entities/services/jwt.service";

@injectable()
export class SocketController implements ISocketController {
  private io?: SocketServer;
  constructor(
    @inject("IMessageUsecase") private messageUsecase: IMessageUsecase,
    @inject("IConversationUsecase")
    private conversationUsecase: IConversationUsecase,
    @inject("IJwtservice") private tokenService: IJwtservice
  ) {}

  initializeSocket(server: Server): void {
    this.io = new SocketServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
      path : "/api/v_1/_chat",
      allowRequest: (
        req: IncomingMessage,
        callback: (err: string | null | undefined, success: boolean) => void
      ) => {
        console.log(req.headers);
        const cookieParser = require("cookie");
        const cookies = req.headers.cookie ? cookieParser.parse(req.headers.cookie) : {};
        console.log('cookies : ',cookies);
        if (!cookies) {
          return callback(
            new CustomError("Unauthorized access ", HTTP_STATUS.UNAUTHORIZED).message,
            false
          );
        }
        // Check for the presence of the access token in cookies
        const tokenNames = [
          "admin_access_token",
          "client_access_token",
          "vendor_access_token",
        ];

        let token: string | undefined;
        for (const tokenName of tokenNames) {
          if (cookies[tokenName]) {
            token = cookies[tokenName];
            break;
          }
        }

        if (!token) {
          return callback(
            new CustomError("Unauthorized access", HTTP_STATUS.UNAUTHORIZED).message,
            false
          );
        }

        const decoded = this.tokenService.verifyAccessToken(token);
        if (!decoded) {
          return callback(
            new CustomError(
              ERROR_MESSAGES.INVALID_TOKEN,
              HTTP_STATUS.UNAUTHORIZED
            ).message,
            false
          );
        }

        (req as CustomRequest).user = {
          _id: decoded._id as string,
          id: decoded.id as string,
          email: decoded.email as string,
          role: decoded.role as string,
          access_token: "",
          refresh_token: "",
        };
        callback(null, true);
      },
    });
    this.initializeSocketEvents()
  }

  initializeSocketEvents(): void {
    if(!this.io) throw new CustomError("Socket server not initialized", HTTP_STATUS.INTERNAL_SERVER_ERROR)

    this.io.on("connection",(socket : Socket)=> {
        console.log(socket);
    })
  }
}
