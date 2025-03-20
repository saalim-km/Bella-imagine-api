import { ICategoryEntity } from "../../models/category.entity";

export interface IGetAllVendorCategoriesUsecase {
    execute():Promise<ICategoryEntity[]>
}