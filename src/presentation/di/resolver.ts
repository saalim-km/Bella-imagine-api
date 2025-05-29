import { container } from "tsyringe";
import { DependencyInjection } from ".";
import { AuthController } from "../controllers/auth-controller";

DependencyInjection.registerAll()

export const authController = container.resolve(AuthController)