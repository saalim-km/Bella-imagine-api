import { PaginatedResult } from "../../../shared/types/pagination.types";
import { ICategory } from "../../models/category";
import { GetCategoryInput } from "../../types/admin.type";
import { IBaseRepository } from "./base.repository";

export interface ICategoryRepository extends IBaseRepository<ICategory> {
    getAllCategories(input : GetCategoryInput) : Promise<PaginatedResult<ICategory>>
    getCatForUsers() : Promise<PaginatedResult<ICategory>>
}