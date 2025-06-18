import { inject, injectable } from "tsyringe";
import { IServiceQueryUsecase } from "../../domain/interfaces/usecase/vendor-usecase.interface";
import { IServiceRepository } from "../../domain/interfaces/repository/service.repository";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";
import { GetServiceInput } from "../../domain/interfaces/usecase/types/vendor.types";
import { IService } from "../../domain/models/service";
import { FilterQuery } from "mongoose";

@injectable()
export class ServiceQueryUsecase implements IServiceQueryUsecase {
    constructor(
        @inject('IServiceRepository') private _serviceRepo : IServiceRepository
    ){}

    async getServices(input: GetServiceInput): Promise<PaginatedResponse<IService>> {
        const {limit,page,category,serviceTitle} = input;
        const skip = (page - 1) * limit;

        let filter : FilterQuery<IService> ={}
        if(category && category!== undefined) {
            filter.category = category
        }

        if(serviceTitle && serviceTitle.trim() !== '') {
            filter = {
                ...filter,
                serviceTitle : {$regex : serviceTitle , $options : 'i'}
            }
        }


        return await this._serviceRepo.getServices(filter,skip,limit,-1)
    }
}