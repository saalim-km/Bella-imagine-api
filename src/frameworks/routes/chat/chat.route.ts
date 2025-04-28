import { Request, Response } from "express";
import { chatController, createContestController, createConversationController, getUserChatsController, getUserContactsController } from "../../di/resolver";
import { BaseRoute } from "../base.route";

export class ChatRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.get("/:userId/:userType", (req: Request, res: Response) => {
      getUserContactsController.handle(req,res)
    });

    this.router.get("/conversations/:userId/:userType",(req : Request , res : Response)=> {
      getUserChatsController.handle(req,res)
    })
  }
}