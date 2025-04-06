import { IServiceEntity } from "../../models/service.entity";

export interface IGetServiceUsecase {
    execute(serviceId : string): Promise<IServiceEntity>
}