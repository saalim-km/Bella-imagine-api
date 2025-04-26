import { inject, injectable } from "tsyringe";
import { IChatController } from "../../../entities/controllerInterfaces/chat/chat-controller.interface";
import { Server as SocketIoServer, DefaultEventsMap, Socket } from "socket.io";
import { IncomingMessage, Server } from "http";
import { Request, Response } from "express";
import { boolean, string } from "zod";
import { IGetUserContactsUsecase } from "../../../entities/usecaseInterfaces/chat/get-user-contacts-usecase.interface";
import { IGetConversationsUsecase } from "../../../entities/usecaseInterfaces/chat/get-conversations-usecase.interface";
import { ISendMessageUsecase } from "../../../entities/usecaseInterfaces/chat/send-message-usecase.interface";
import { IGetMessageUsecase } from "../../../entities/usecaseInterfaces/chat/get-messages-usecase.interface";
import { IMessageEntity } from "../../../entities/models/message.entity";
import { IClientRepository } from "../../../entities/repositoryInterfaces/client/client-repository.interface";
import { IVendorRepository } from "../../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { TRole } from "../../../shared/constants";
import { IUpdateUserOnlineStatusUsecase } from "../../../entities/usecaseInterfaces/chat/update-user-online-status-usecase.interface";

@injectable()
export class ChatController implements IChatController {
    public io?: SocketIoServer

    constructor(
        @inject('IGetUserContactsUsecase') private getUserContactsUsecae : IGetUserContactsUsecase,
        @inject('IGetConversationsUsecase') private getConversationUsecase : IGetConversationsUsecase,
        @inject('ISendMessageUsecase') private sendMessageUsecase : ISendMessageUsecase,
        @inject('IGetMessageUsecase') private getMessagesUsecase : IGetMessageUsecase,
        @inject("IUpdateUserOnlineStatusUsecase") private updateUserOnlineStatus : IUpdateUserOnlineStatusUsecase
    ){}

    initialize(server: Server): void {
        this.io = new SocketIoServer(server,{
            cors : {
                origin : "*",
                methods : ["GET","POST"],
                credentials : true,
            },
            path : "/path/_chat",
            transports : ["websocket","polling"]
        }),
        this.io.use(async (socket,next)=> {
            const {userId , userType} = socket.handshake.auth;
            socket.data = {userId , userType}
            next()
        })
        this.initializeSocketEvents()
    }

    initializeSocketEvents(): void {
        if(!this.io) throw new Error("socket not initialized");

        const connectedUser = new Map<string , string[]>()
        console.log('socketio events initialized ❤️');


        this.io?.on("connection",async(socket)=> {
            const {userId , userType} = socket.data;
            console.log(`User Connected ✅ userId => ${userId} role => ${userType}`);

            socket.join(userId)
            await this.updateUserOnlineStatus.execute(userId,userType,true)

            socket.on("disconnect",async()=> {
                console.log('user disconnected ❌',socket.id);
                await this.updateUserOnlineStatus.execute(userId,userType,false);
            })

            socket.on("get_contacts",async(callback)=> {
                const contacts = await this.getUserContactsUsecae.execute(userId,userType)
                callback(contacts)
            })
        })
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            
        } catch (error) {
            console.log('error occured while feching user chats',error);
        }
    }
}