import { injectable } from "tsyringe";
import { IChatController } from "../../../entities/controllerInterfaces/chat/chat-controller.interface";
import { Server as SocketIoServer, DefaultEventsMap, Socket } from "socket.io";
import { IncomingMessage, Server } from "http";
import { Request, Response } from "express";
import { boolean, string } from "zod";

@injectable()
export class ChatController implements IChatController {
    public io?: SocketIoServer

    constructor(){}

    initialize(server: Server): void {
        this.io = new SocketIoServer(server,{
            cors : {
                origin : "*",
                methods : ["GET","POST"],
                credentials : true,
            },
            path : "/api/v_1/_chat",
        })
        this.initializeSocketEvents()
    }

    initializeSocketEvents(): void {
        console.log('socketio events initialized ❤️');
        this.io?.on("connection",(socket: Socket)=> {

            const {userId , userType} = socket.handshake.auth;
            console.log("user connected : ",socket.id);
            console.log(userId,userType);

            socket.on('disconnect',(reaason)=> {
                console.log(`User disconnected: ${socket.id}`);
                console.log(`Reason: ${reaason}`);
                console.log(`User ID: ${socket.data.userId}, Type: ${socket.data.userType}`);
            })


            
            
            if(!userId || !userType) {
                console.log('disconnect triggered');
                socket.disconnect()
                return;
            }
        })
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            console.log(req.body);
        } catch (error) {
            console.log('error occured while feching user chats',error);
        }
    }
}