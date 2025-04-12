import { PaginatedRequestCategory } from "../../../../shared/types/admin/admin.type";
import { PaginatedCategories } from "../../../models/paginated-category.entity";

export interface IGetAllPaginatedCategoryUseCase {
  execute(
    filter : PaginatedRequestCategory,
    page : number,
    limit : number,
  ): Promise<PaginatedCategories>;
}
