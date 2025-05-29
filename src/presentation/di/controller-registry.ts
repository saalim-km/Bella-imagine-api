import { container } from "tsyringe";
import { AuthController } from "../controllers/auth-controller";

export class ControllerRegistry {
    static registerControllers(): void {
        container.register('IAuthController', { useClass: AuthController })
    }
}