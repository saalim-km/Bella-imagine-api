import { ObjectId } from "mongoose";
import { TCategoryRequestStatus } from "../../../shared/types/admin/admin.type";

export interface IUpdateCategoryRequestStatusUsecase {
    execute(vendorId : ObjectId , categoryId : ObjectId , status : TCategoryRequestStatus) : Promise<void>
}