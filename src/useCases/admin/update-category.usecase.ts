import { inject, injectable } from "tsyringe";
import { IUpdateCategoryUsecase } from "../../entities/usecaseInterfaces/admin/update-category-usecase.interface";
import { ICategoryRepository } from "../../entities/repositoryInterfaces/common/category-repository.interface";
import { ICategoryEntity } from "../../entities/models/category.entity";

@injectable()
export class UpdateCategoryUsecase implements IUpdateCategoryUsecase {
    constructor(
        @inject("ICategoryRepository") private categoryRepository : ICategoryRepository
    ){}

    async execute(id: string, data: Partial<ICategoryEntity>): Promise<void> {
        console.log('--------------------------UpdateCategoryUsecase-------------------------');
        console.log(id,data);
        await this.categoryRepository.findByIdAndUpdateCategory(id,data)
    }
}