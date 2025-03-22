import { injectable } from "tsyringe";
import { ICategoryRequestEntity } from "../../../entities/models/category-request.entity";
import { ICategoryRequestRepository } from "../../../entities/repositoryInterfaces/common/category-reqeust-repository.interface";
import { CategoryRequestModel } from "../../../frameworks/database/models/catgory-request.model";
import { ObjectId } from "mongoose";
import { TCategoryRequestStatus } from "../../../shared/types/admin/admin.type";

@injectable()
export class CategoryRequestRepository implements ICategoryRequestRepository {
  async save(
    vendorId: ObjectId,
    categoryId: ObjectId
  ): Promise<ICategoryRequestEntity> {
    return await CategoryRequestModel.create({ vendorId, categoryId });
  }

  async findById(id: any): Promise<ICategoryRequestEntity | null> {
    return await CategoryRequestModel.findById(id);
  }

  async findByVendorAndCategory(
    vendorId: ObjectId,
    categoryId: ObjectId
  ): Promise<ICategoryRequestEntity | null> {
    return await CategoryRequestModel.findOne({ vendorId, categoryId });
  }

  async findByVendorId(vendorId: any): Promise<ICategoryRequestEntity | null> {
    return await CategoryRequestModel.findOne({ vendorId });
  }

  async find(): Promise<ICategoryRequestEntity[] | []> {
    return await CategoryRequestModel.find()
      .populate({
        path: "vendorId",
        select: "name email",
      })
      .populate({
        path: "categoryId",
        select: "title categoryId",
      })
      .sort({ createdAt: -1 })
      .lean();
  }

  async findByIdAndUpdateStatus(id: any, status: TCategoryRequestStatus): Promise<void> {
    await CategoryRequestModel.findByIdAndUpdate(id, {
      $set: { status : status },
    });
  }
}
