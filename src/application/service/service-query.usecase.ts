import { inject, injectable } from "tsyringe";
import { IServiceQueryUsecase } from "../../domain/interfaces/usecase/vendor-usecase.interface";
import { IServiceRepository } from "../../domain/interfaces/repository/service.repository";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";
import { GetServiceInput, GetWorkSampleInput } from "../../domain/interfaces/usecase/types/vendor.types";
import { IService } from "../../domain/models/service";
import { FilterQuery } from "mongoose";
import { IWorkSample } from "../../domain/models/worksample";
import { IWorksampleRepository } from "../../domain/interfaces/repository/worksample.repository";
import { IGetPresignedUrlUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";

@injectable()
export class ServiceQueryUsecase implements IServiceQueryUsecase {
    constructor(
        @inject('IServiceRepository') private _serviceRepo : IServiceRepository,
        @inject('IWorksampleRepository') private _workSampleRepo : IWorksampleRepository,
        @inject('IGetPresignedUrlUsecase') private _pregisnedUrl : IGetPresignedUrlUsecase
    ){}

    async getServices(input: GetServiceInput): Promise<PaginatedResponse<IService>> {
        const {limit,page,category,serviceTitle,vendor} = input;
        const skip = (page - 1) * limit;

        let filter : FilterQuery<IService> ={vendor : vendor}
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

    async getWorkSmaples(input: GetWorkSampleInput): Promise<PaginatedResponse<IWorkSample>> {
        const {limit,page,service,title,vendor,isPublished} = input;
        const skip = (page - 1) * limit;
        let filter : FilterQuery<IWorkSample> = {vendor : vendor}
        if(service && service!== undefined) {
            filter.service = service;
        }
        if(title && title.trim() !== '') {
            filter = {
                ...filter,
                title : {$regex : title , $options : 'i'}
            }
        }

        if(isPublished !== undefined ){
            filter.isPublished = isPublished
        }
        
        const {data , total} =  await this._workSampleRepo.getWorkSamples(filter,skip,limit)
        await Promise.all(
        data.map(async (sample) => {
            const urls = await Promise.all(
            sample.media.map((image) => this._pregisnedUrl.getPresignedUrl(image))
            );
            sample.media = urls;
        })
        );
        return {
            data : data,
            total : total
        }
    }
}