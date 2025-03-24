import { injectable } from "tsyringe";
import { IServiceRepository } from "../../../entities/repositoryInterfaces/service/service-repository.interface";
import { IServiceEntity } from "../../../entities/models/service.entity";
import { serviceModel } from "../../../frameworks/database/models/service.model";

@injectable()
export class ServiceRepository implements IServiceRepository {
    async create(serviceData: Partial<IServiceEntity>): Promise<void> {
        await serviceModel.create(serviceData)
    }

    async findByServiceName(name: string): Promise<IServiceEntity | null> {
        return await serviceModel.findOne({serviceName : { $regex: new RegExp(`^${name.trim()}$`, "i") }})
    }
}