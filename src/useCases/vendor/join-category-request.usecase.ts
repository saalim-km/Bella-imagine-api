import { ObjectId } from "mongoose";
import { IJoinCategoryRequestUsecase } from "../../entities/usecaseInterfaces/vendor/join-category-reqeust-usecase.interface";
import { inject, injectable } from "tsyringe";
import { ICategoryRequestRepository } from "../../entities/repositoryInterfaces/common/category-reqeust-repository.interface";
import { CustomError } from "../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../shared/constants";
import { INotificationRepository } from "../../entities/repositoryInterfaces/common/notification-repository.interface";

@injectable()
export class JoinCategoryRequestUseCase implements IJoinCategoryRequestUsecase {
  constructor(
    @inject("ICategoryRequestRepository")
    private categoryRequestRepository: ICategoryRequestRepository,
    @inject("INotificationRepository") private notificationRepository : INotificationRepository
  ) {}
  async execute(vendorId: ObjectId, categoryId: ObjectId): Promise<void> {
    const categoryRequest =
      await this.categoryRequestRepository.findByVendorAndCategory(
        vendorId,
        categoryId
      );

      console.log(vendorId,categoryId);
    if (categoryRequest) {
      throw new CustomError("Already Requested", HTTP_STATUS.CONFLICT);
    }

    await this.categoryRequestRepository.save(vendorId, categoryId);
    await this.notificationRepository.save({
      message: "Your request to join the category has been submitted successfully.",
      receiverId: vendorId.toString(),
    });
  }
}