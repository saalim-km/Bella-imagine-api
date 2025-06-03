import { container } from "tsyringe";
import { AuthController } from "../controllers/auth.controller";
import { AdminController } from "../controllers/admin.controller";

export class ControllerRegistry {
    static registerControllers(): void {
        container.register('IAuthController', { useClass: AuthController })
        container.register('IAdminController' , {useClass : AdminController})
    }
}