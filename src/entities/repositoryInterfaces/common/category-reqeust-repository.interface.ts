import { ObjectId } from "mongoose";
import { ICategoryRequestEntity } from "../../models/category-request.entity";
import { TCategoryRequestStatus } from "../../../shared/types/admin/admin.type";

export interface ICategoryRequestRepository {
  save(
    vendorId: ObjectId,
    categoryId: ObjectId
  ): Promise<ICategoryRequestEntity | null>;

  findById(id: any): Promise<ICategoryRequestEntity | null>;

  findByVendorAndCategory(
    vendorId: ObjectId | string,
    categoryId: ObjectId
  ): Promise<ICategoryRequestEntity | null>;

  findByVendorId(vendorId: any): Promise<ICategoryRequestEntity | null>;

  find(): Promise<ICategoryRequestEntity[] | []>;

  findByIdAndUpdateStatus(id: any, status: TCategoryRequestStatus): Promise<void>;
}