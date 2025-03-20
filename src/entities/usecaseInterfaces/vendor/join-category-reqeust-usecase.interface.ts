import { ObjectId } from "mongoose";

export interface IJoinCategoryRequestUsecase {
    execute(vendorId : ObjectId , categoryId : ObjectId) : Promise<void>
}