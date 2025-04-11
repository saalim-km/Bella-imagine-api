import { inject, injectable } from "tsyringe";
import { IUpdateCategoryRequestStatusUsecase } from "../../entities/usecaseInterfaces/admin/update-category-request-status-usecase.interface";
import { ObjectId } from "mongoose";
import { ICategoryRequestRepository } from "../../entities/repositoryInterfaces/common/category-reqeust-repository.interface";
import { CustomError } from "../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../shared/constants";
import { TCategoryRequestStatus } from "../../shared/types/admin/admin.type";
import { INotificationRepository } from "../../entities/repositoryInterfaces/common/notification-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";

@injectable()
export class UpdateCategoryRequestStatusUsecase
  implements IUpdateCategoryRequestStatusUsecase
{
  constructor(
    @inject("ICategoryRequestRepository")
    private categoryRequestRepository: ICategoryRequestRepository,
    @inject("INotificationRepository") private notificationRepository : INotificationRepository,
    @inject("IVendorRepository") private vendorRepository : IVendorRepository
  ) {}

  async execute(
    vendorId: ObjectId,
    categoryId: ObjectId,
    status: TCategoryRequestStatus
  ): Promise<void> {
    const allowedStatuses = ["approved", "rejected"];
  
    if (!vendorId || !categoryId) {
      throw new CustomError(
        "Vendor ID and Category ID are required.",
        HTTP_STATUS.NOT_FOUND
      );
    }
  
    const categoryRequest =
      await this.categoryRequestRepository.findByVendorAndCategory(
        vendorId,
        categoryId
      );
  
    if (!categoryRequest) {
      throw new Error("Category join request not found.");
    }
  
    if (categoryRequest.status === "approved") {
      throw new Error("This request is already approved.");
    }
  
    if (categoryRequest.status === "rejected") {
      throw new Error("This request is already rejected.");
    }
  
    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid status update.");
    }
  
    // Always update the request status
    await this.categoryRequestRepository.findByIdAndUpdateStatus(
      categoryRequest._id,
      status
    );
  
    // If approved, update the vendor profile
    if (status === "approved") {
      const vendor = await this.vendorRepository.findById(vendorId);
      const newCategories: ObjectId[] = vendor?.categories
        ? [...vendor.categories, categoryId]
        : [categoryId];
  
      await this.vendorRepository.findByIdAndUpdateVendorCategories(
        vendorId,
        newCategories
      );
    }
  
    // Always send a notification
    await this.notificationRepository.save({
      message: `Your category join request has been ${status}. For any inquiry, please contact Bella Imagine Team.`,
      receiverId: vendorId.toString(),
    });
  }
  
}
