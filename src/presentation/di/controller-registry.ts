import { container } from "tsyringe";
import { AuthController } from "../controllers/auth.controller";
import { AdminController } from "../controllers/admin.controller";
import { ClientController } from "../controllers/client.controller";
import { VendorController } from "../controllers/vendor.controller";
import { CommunityController } from "../controllers/community.controller";
import { ChatController } from "../controllers/chat.controller";

export class ControllerRegistry {
    static registerControllers(): void {
        container.register('IAuthController', { useClass: AuthController })
        container.register('IAdminController' , {useClass : AdminController})
        container.register('IClientController' , {useClass: ClientController})
        container.register('IVendorController' , {useClass : VendorController})
        container.register('ICommunityController' , {useClass : CommunityController})
        container.register('IChatController',{useClass : ChatController})
    }
}