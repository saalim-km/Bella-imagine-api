import { ObjectId } from "mongoose";
import { ICategoryRequestEntity } from "../../models/category-request.entity";

export interface ICategoryRequestRepository {
  save(
    vendorId: ObjectId,
    categoryId: ObjectId
  ): Promise<ICategoryRequestEntity | null>;

  findById(id: any): Promise<ICategoryRequestEntity | null>;

  findByVendorAndCategory(
    vendorId: ObjectId,
    categoryId: ObjectId
  ): Promise<ICategoryRequestEntity | null>;

  findByVendorId(vendorId: any): Promise<ICategoryRequestEntity | null>;

  find(): Promise<ICategoryRequestEntity[] | []>;

  findByIdAndUpdateStatus(id: any, status: string): Promise<void>;
}