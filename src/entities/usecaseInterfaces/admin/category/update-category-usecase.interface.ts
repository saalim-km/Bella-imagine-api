import { ICategoryEntity } from "../../../models/category.entity"

export interface IUpdateCategoryUsecase {
    execute(id : string , data : Partial<ICategoryEntity>): Promise<void>
}