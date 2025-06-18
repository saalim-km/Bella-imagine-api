import { asyncHandler } from "../../../shared/utils/helper/async-handler";
import { chatController } from "../../di/resolver";
import { upload } from "../../middlewares/multer.middleware";
import { BaseRoute } from "../base.route";

export class ChatRoute extends BaseRoute {
    protected initializeRoutes(): void {
        this.router
        .post('/upload-media',upload.single('media'),asyncHandler(chatController.uploadMedia.bind(chatController)))
    }
} 