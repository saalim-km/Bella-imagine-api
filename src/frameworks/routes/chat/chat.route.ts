import { Request, Response } from "express";
import { chatController } from "../../di/resolver";
import { BaseRoute } from "../base.route";
import { upload } from "../../../interfaceAdapters/middlewares/multer.middleware";
import { asyncHandler } from "../../../shared/handler/async-handler.utils";

export class ChatRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.post('/upload-media',upload.single('media'),asyncHandler(
      chatController.uploadMedia.bind(chatController)
    ))
  }
}