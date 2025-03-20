import { ICategoryEntity } from "../../models/category.entity";
import { PaginatedCategories } from "../../models/paginated-category.entity";

export interface ICategoryRepository {
  find(): Promise<ICategoryEntity[] | []>;

  save(title: string, categoryId: string , status : boolean): Promise<ICategoryEntity>;

  findByTitle(title: string): Promise<ICategoryEntity | null>;

  findById(id: any): Promise<ICategoryEntity | null>;

  findPaginatedCategory(
    filter: Record<string,any>,
    skip: number,
    limit: number
  ): Promise<PaginatedCategories>;

  findByIdAndUpdateCategory(id: any , data : Partial<ICategoryEntity>): Promise<void>;
}
