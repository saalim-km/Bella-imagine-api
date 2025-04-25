import { Request, Response } from "express";
import { chatController, createContestController, createConversationController } from "../../di/resolver";
import { BaseRoute } from "../base.route";

export class ChatRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.get("/:userId/:userType", (req: Request, res: Response) => {
      
    });

    this.router.post("/create", (req: Request, res: Response) => {
      createConversationController.handle(req, res);
    });
  }
}
