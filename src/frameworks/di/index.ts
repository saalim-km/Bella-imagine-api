import { ControllerRegistry } from "./controller.registry";
import { RepositoryRegistry } from "./repository.registry";
import { UsecaseRegistry } from "./usecase.registry";

export class DependencyInjection {
    static registerAll(): void {
        UsecaseRegistry.registerUsecase();
        RepositoryRegistry.registerRepositories();
        ControllerRegistry.registerController();
    }
}