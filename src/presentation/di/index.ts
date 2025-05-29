import { ControllerRegistry } from "./controller-registry"
import { ServiceRegistry } from "./service-registry"
import { UsecaseRegistry } from "./usecase-registry"

export class DependencyInjection{
    static registerAll(): void {
        ServiceRegistry.registerServices(),
        UsecaseRegistry.registerUsecases(),
        ControllerRegistry.registerControllers()
    }
}