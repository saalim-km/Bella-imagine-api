import { Request, Response } from "express";
import { chatController, createConversationController, getUserChatsController, getUserContactsController } from "../../di/resolver";
import { BaseRoute } from "../base.route";
import { upload } from "../../../interfaceAdapters/middlewares/multer.middleware";

export class ChatRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.post('/upload-media',upload.single('media'),(req : Request , res : Response)=> {
      chatController.uploadMedia(req,res)
    })
  }
}