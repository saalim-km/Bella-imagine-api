import { inject, injectable } from "tsyringe";
import { IGetAllClientCategoriesUsecase } from "../../entities/usecaseInterfaces/client/get-all-client-categories-usecase.interface";
import { ICategoryRepository } from "../../entities/repositoryInterfaces/common/category-repository.interface";
import { ICategoryEntity } from "../../entities/models/category.entity";

@injectable()
export class GetAllClientCategoriesUsecase implements IGetAllClientCategoriesUsecase {
    constructor(
        @inject("ICategoryRepository") private categoryRepository : ICategoryRepository
    ){}

    async execute(): Promise<ICategoryEntity[]> {
        return await this.categoryRepository.find()
    }
}