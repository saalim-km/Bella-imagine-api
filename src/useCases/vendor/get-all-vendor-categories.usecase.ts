import { inject, injectable } from "tsyringe";
import { IGetAllVendorCategoriesUsecase } from "../../entities/usecaseInterfaces/vendor/get-all-vendor-categories-usecase.interface";
import { ICategoryRepository } from "../../entities/repositoryInterfaces/common/category-repository.interface";
import { ICategoryEntity } from "../../entities/models/category.entity";

@injectable()
export class GetAllVendorCategoriesUsecase implements IGetAllVendorCategoriesUsecase {
    constructor(
        @inject("ICategoryRepository") private categoryRepository : ICategoryRepository
    ){}

    async execute(): Promise<ICategoryEntity[]> {
        return await this.categoryRepository.find()
    }
}