import { ICategoryEntity } from "../../models/category.entity"

export interface IGetAllClientCategoriesUsecase {
    execute(): Promise<ICategoryEntity[]>
}