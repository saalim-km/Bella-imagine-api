import { inject, injectable } from "tsyringe";
import { IUpdateCategoryRequestStatusUsecase } from "../../../entities/usecaseInterfaces/admin/category/update-category-request-status-usecase.interface";
import { ICategoryRequestRepository } from "../../../entities/repositoryInterfaces/common/category-reqeust-repository.interface";
import { INotificationRepository } from "../../../entities/repositoryInterfaces/common/notification-repository.interface";
import { IVendorRepository } from "../../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { ObjectId } from "mongoose";
import { TCategoryRequestStatus } from "../../../shared/types/admin/admin.type";
import { CustomError } from "../../../entities/utils/custom-error";
import {
  CATEGORY_APPROVED_MAIL_CONTENT,
  ERROR_MESSAGES,
  HTTP_STATUS,
} from "../../../shared/constants";
import { IEmailService } from "../../../entities/services/email-service.interface";
import { ICategoryRepository } from "../../../entities/repositoryInterfaces/common/category-repository.interface";

@injectable()
export class UpdateCategoryRequestStatusUsecase
  implements IUpdateCategoryRequestStatusUsecase
{
  constructor(
    @inject("ICategoryRequestRepository")
    private categoryRequestRepository: ICategoryRequestRepository,
    @inject("IVendorRepository") private vendorRepository: IVendorRepository,
    @inject("IEmailService") private emailService: IEmailService,
    @inject("ICategoryRepository")
    private categoryRepository: ICategoryRepository
  ) {}

  async execute(
    vendorId: ObjectId | string,
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
      throw new CustomError(
        "Category join request not found.",
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (categoryRequest.status === "approved") {
      throw new CustomError(
        "This request is already approved.",
        HTTP_STATUS.CONFLICT
      );
    }

    if (categoryRequest.status === "rejected") {
      throw new CustomError(
        "This request is already rejected.",
        HTTP_STATUS.CONFLICT
      );
    }

    if (!allowedStatuses.includes(status)) {
      throw new CustomError("Invalid status update.", HTTP_STATUS.BAD_REQUEST);
    }

    const categoryExists = await this.categoryRepository.findById(categoryId);

    const vendor = await this.vendorRepository.findById(vendorId);

    if (!vendor) {
      throw new CustomError(
        ERROR_MESSAGES.VENDOR_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (!categoryExists) {
      throw new CustomError(
        ERROR_MESSAGES.CATEGORY_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Always update the request status
    await this.categoryRequestRepository.findByIdAndUpdateStatus(
      categoryRequest._id,
      status
    );

    // If approved, update the vendor profile
    if (status === "approved") {
      const newCategories: ObjectId[] = vendor?.categories
        ? [...vendor.categories, categoryId]
        : [categoryId];

      await this.vendorRepository.findByIdAndUpdateVendorCategories(
        vendorId,
        newCategories
      );
    }

    console.log("vendorid before sending email", vendorId);
    await this.emailService.sendEmail(
      vendor.email,
      "Category Request Status Update",
      CATEGORY_APPROVED_MAIL_CONTENT(categoryExists.title)
    );
  }
}
