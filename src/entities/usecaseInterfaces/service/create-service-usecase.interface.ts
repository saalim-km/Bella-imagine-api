import { IServiceEntity } from "../../models/service.entity";

export interface ICreateServiceUsecase {
    execute(data : Partial<IServiceEntity>,vendorId : string) : Promise<void>
}