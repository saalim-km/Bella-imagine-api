import { container } from "tsyringe";
import { DependencyInjection } from ".";
import { AuthController } from "../controllers/auth.controller";
import { AdminController } from "../controllers/admin.controller";

DependencyInjection.registerAll()

export const authController = container.resolve(AuthController)

export const adminController = container.resolve(AdminController)