import { inject, injectable } from "tsyringe";
import { IChatController } from "../../../entities/controllerInterfaces/chat/chat-controller.interface";
import { Server as SocketIoServer } from "socket.io";
import { Request, Response } from "express";
import { IGetUserContactsUsecase } from "../../../entities/usecaseInterfaces/chat/get-user-contacts-usecase.interface";
import { IGetConversationsUsecase } from "../../../entities/usecaseInterfaces/chat/get-conversations-usecase.interface";
import { ISendMessageUsecase } from "../../../entities/usecaseInterfaces/chat/send-message-usecase.interface";
import { IGetMessageUsecase } from "../../../entities/usecaseInterfaces/chat/get-messages-usecase.interface";
import { IMessageEntity } from "../../../entities/models/message.entity";
import { IUpdateUserOnlineStatusUsecase } from "../../../entities/usecaseInterfaces/chat/update-user-online-status-usecase.interface";
import { IUpdateLastSeenUsecase } from "../../../entities/usecaseInterfaces/chat/update-last-seen-usecase.interface";
import { handleError } from "../../../shared/utils/error-handler.utils";
import { IUploadMediaChatUsecase } from "../../../entities/usecaseInterfaces/chat/upload-media-chat-usecase.interface";
import { Server } from "http";

@injectable()
export class ChatController implements IChatController {
    public io?: SocketIoServer

    constructor(
        @inject('IGetUserContactsUsecase') private getUserContactsUsecae : IGetUserContactsUsecase,
        @inject('IGetConversationsUsecase') private getConversationUsecase : IGetConversationsUsecase,
        @inject('ISendMessageUsecase') private sendMessageUsecase : ISendMessageUsecase,
        @inject('IGetMessageUsecase') private getMessagesUsecase : IGetMessageUsecase,
        @inject("IUpdateUserOnlineStatusUsecase") private updateUserOnlineStatus : IUpdateUserOnlineStatusUsecase,
        @inject('IUpdateLastSeenUsecase') private updateLastSeenUsecase : IUpdateLastSeenUsecase,
        @inject('IUploadMediaChatUsecase') private uploadMediaUsecase : IUploadMediaChatUsecase
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

        console.log('socketio events initialized ❤️');


        this.io.on("connection",async(socket)=> {
            const {userId , userType} = socket.data;
            console.log(`User Connected ✅ userId => ${userId} role => ${userType}`);

            socket.on('join',async ({userId , userType})=> {
                console.log('join event triggered 😘',userId);
                socket.join(userId)
                await this.updateUserOnlineStatus.execute(userId,userType,true)
                socket.broadcast.emit('user_status',{userId , userType , status : true })
            })


            socket.on("disconnect",async()=> {
                console.log('user disconnected ❌ triggered',socket.id);
                const lastSeen = new Date().toString();
                
                await this.updateUserOnlineStatus.execute(userId,userType,false);
                socket.broadcast.emit('user_status',{userId,userType,status : false})
                await this.updateLastSeenUsecase.execute(userId,lastSeen,userType)
                socket.broadcast.emit('update_lastseen',{userId , lastSeen})
            })

            socket.on("send_message",async ({message , recipentId} : {message : IMessageEntity , recipentId : string})=> {
                try {   
                    console.log('send_message trigger ✅💀',);
                    console.log(message,recipentId);
                    const newMessage = await this.sendMessageUsecase.execute(message);
                    console.log('new message from client : ',newMessage);
                    this.io?.to(recipentId.toString()).emit("new_message",newMessage)
                    this.io?.to(message.senderId.toString()).emit("new_message",newMessage)
                } catch (error) {
                    console.log(error);
                }
            })

            socket.on('get_contacts',async ({userId , userType})=> {
                try {
                    console.log('getcontacts triggered 😘😘😘');
                    const contacts = await this.getUserContactsUsecae.execute(userId,userType)
                    console.log('got contacts',contacts);
                    socket.emit('contacts',contacts)
                } catch (error) {
                    console.log(error);
                }   
            })

            socket.on('get_conversations',async({userId , userType})=> {
                try {
                    console.log('get_conversations triggered');
                    console.log(userId , userType);
                    const conversations = await this.getConversationUsecase.execute(userId,userType);
                    socket.emit('conversations',conversations)
                } catch (error) {
                    console.log(error);
                }
            })

            socket.on('get_messages',async ({conversationId})=> {
                try {
                    console.log(conversationId);
                    const messages = await this.getMessagesUsecase.execute(conversationId)
                    console.log('user messages : ',messages);
                    socket.emit('messages',messages)
                } catch (error) {
                    console.log(error);
                }
            })
        })
    }

    async uploadMedia(req: Request, res: Response): Promise<void> {
        try {
            console.log(req.file);
            const {conversationId} = req.body;
            const response = await this.uploadMediaUsecase.execute(req.file!,conversationId);
            console.log('got the file key and fileurl from usecase : ',response);
            res.status(200).json(response)
        } catch (error) {
            handleError(error,res)
        }
    }
}