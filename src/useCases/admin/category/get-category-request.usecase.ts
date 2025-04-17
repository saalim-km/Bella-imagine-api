import { inject, injectable } from "tsyringe";
import { ICategoryRequestRepository } from "../../../entities/repositoryInterfaces/common/category-reqeust-repository.interface";
import { IGetCategoryRequestUsecase } from "../../../entities/usecaseInterfaces/admin/category/get-category-request-usecase.interface";
import { ICategoryRequestEntity } from "../../../entities/models/category-request.entity";

@injectable()
export class GetCategoryRequestUsecase implements IGetCategoryRequestUsecase {
    constructor(
        @inject("ICategoryRequestRepository") private categoryReqeustRepository : ICategoryRequestRepository
    ){}

    async execute(): Promise<ICategoryRequestEntity[]> {
        const result =  await this.categoryReqeustRepository.find()
        return result
    }
}