import { IServiceEntity } from "../../models/service.entity";

export interface IUpdateServiceUsecase {
    execute(data : IServiceEntity) : Promise<void>
}