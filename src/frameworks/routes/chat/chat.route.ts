import { Request, Response } from "express";
import { conversationController, messageController } from "../../di/resolver";
import { BaseRoute } from "../base.route";

export class ChatRoute extends BaseRoute {
    constructor() {
        super()
    }

    protected initializeRoutes(): void {
        this.router.post('/conversation', (req : Request ,res : Response)=> {
            conversationController.createConversationController(req,res)
        })

        this.router.get('/conversation/user/:userId', (req : Request ,res : Response)=> {
            conversationController.getUserConversationsController(req,res)
        })

        this.router.get('/message/:conversationId',(req : Request ,res : Response)=> {
            messageController.getMessagesController(req,res)
        })
    }
}