import { container } from "tsyringe";
import { DependencyInjection } from ".";
import { AuthController } from "../controllers/auth.controller";
import { AdminController } from "../controllers/admin.controller";
import { ClientController } from "../controllers/client.controller";
import { VendorController } from "../controllers/vendor.controller";
import { CommunityController } from "../controllers/community.controller";
import { SocketService } from "../../interfaceAdapters/services/socket.service";
import { ChatController } from "../controllers/chat.controller";

DependencyInjection.registerAll()

export const authController = container.resolve(AuthController)

export const adminController = container.resolve(AdminController)

export const clientController = container.resolve(ClientController)

export const vendorController = container.resolve(VendorController)

export const communityController = container.resolve(CommunityController)

export const socketService = container.resolve(SocketService)

export const chatController = container.resolve(ChatController)