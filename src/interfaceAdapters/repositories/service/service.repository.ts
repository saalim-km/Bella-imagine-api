import { injectable } from "tsyringe";
import { IServiceRepository } from "../../../entities/repositoryInterfaces/service/service-repository.interface";
import { IServiceEntity } from "../../../entities/models/service.entity";
import { serviceModel } from "../../../frameworks/database/models/service.model";
import { IServiceFilter } from "../../../shared/types/vendor/service.type";
import { PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { ObjectId } from "mongoose";

@injectable()
export class ServiceRepository implements IServiceRepository {
    async create(serviceData: Partial<IServiceEntity>): Promise<IServiceEntity> {
        return await serviceModel.create(serviceData)
    }

    async findByServiceName(name: string): Promise<IServiceEntity | null> {
        return await serviceModel.findOne({serviceTitle : { $regex: new RegExp(`^${name.trim()}$`, "i") }})
    }

    async findAllServiceByVendor(
        filter: IServiceFilter,
        skip: number,
        limit: number,
        sort?: any
      ): Promise<PaginatedResponse<IServiceEntity>> {
        const [services, total] = await Promise.all([
          serviceModel
            .find(filter)
            .populate({
                path : 'category'
            })
            .sort(sort)
            .skip(skip)
            .limit(limit),
          serviceModel.countDocuments(filter),
        ]);
    
        return {
          data: services,
          total: total,
        };
    }


    async update(id: string | ObjectId, updateData: Partial<IServiceEntity>): Promise<IServiceEntity | null> {
      return await serviceModel.findByIdAndUpdate(id,updateData);
    }
}