import { ICategoryRequestEntity } from "../../../models/category-request.entity"

export interface IGetCategoryRequestUsecase {
    execute() : Promise<ICategoryRequestEntity[]>
}