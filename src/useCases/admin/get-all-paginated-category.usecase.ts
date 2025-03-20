import { inject, injectable } from "tsyringe";
import { PaginatedCategories } from "../../entities/models/paginated-category.entity";
import { ICategoryRepository } from "../../entities/repositoryInterfaces/common/category-repository.interface";
import { IGetAllPaginatedCategoryUseCase } from "../../entities/usecaseInterfaces/admin/get-all-paginated-category-usecase.interface";
import { PaginatedRequestCategory } from "../../shared/types/admin/admin.type";
import { query } from "express";

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
