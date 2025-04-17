import { inject, injectable } from "tsyringe";
import { IGetAllPaginatedCategoryUseCase } from "../../../entities/usecaseInterfaces/admin/category/get-all-paginated-category-usecase.interface";
import { ICategoryRepository } from "../../../entities/repositoryInterfaces/common/category-repository.interface";
import { PaginatedCategories } from "../../../entities/models/paginated-category.entity";

@injectable()
export class GetAllPaginatedCategoryUseCase
  implements IGetAllPaginatedCategoryUseCase
{
  constructor(
    @inject("ICategoryRepository")
    private categoryRepository: ICategoryRepository
  ) {}
  async execute(
    filter: Record<string, any>,
    page: number,
    limit: number
  ): Promise<PaginatedCategories> {
    const skip = (page - 1) * limit;
    return this.categoryRepository.findPaginatedCategory(filter, skip, limit);
  }
}
