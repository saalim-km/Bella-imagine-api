import { Request, Response } from "express";
import { chatController, createChatRoomController } from "../../di/resolver";
import { BaseRoute } from "../base.route";

export class ChatRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.get("/:userId/:userType", (req: Request, res: Response) => {
      chatController.handle(req, res);
    });
    this.router.post("/create", (req: Request, res: Response) => {
      createChatRoomController.handle(req, res);
    });
  }
}
