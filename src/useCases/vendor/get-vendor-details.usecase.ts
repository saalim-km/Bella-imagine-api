import { inject, injectable } from "tsyringe";
import { IGetVendorDetailsUsecase } from "../../entities/usecaseInterfaces/vendor/get-vendor-details-usecase.interaface";
import { IVendorEntity } from "../../entities/models/vendor.entity";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IAwsS3Service } from "../../entities/services/awsS3-service.interface";
import { redisClient } from "../../frameworks/redis/redis.client";
import { config } from "../../shared/config";
import { s3UrlCache } from "../../frameworks/di/resolver";

@injectable()
export class GetVendorDetailUsecase implements IGetVendorDetailsUsecase {
  constructor(
    @inject("IVendorRepository") private vendorRepository: IVendorRepository,
    @inject("IAwsS3Service") private awsS3Service: IAwsS3Service
  ) {}

  async execute(id: string): Promise<IVendorEntity | null> {
    if (!id) {
      throw new Error("id is missing");
    }

    const data = await this.vendorRepository.findById(id);

    // Handle profileImage
    if (data?.profileImage) {
      const cachedProfileUrl = await s3UrlCache.getCachedSignUrl(data.profileImage)
      data.profileImage = cachedProfileUrl;
    }

    // Handle verificationDocument
    if (data?.verificationDocument) {
      const cachedDocUrl = await s3UrlCache.getCachedSignUrl(data.verificationDocument)
      data.verificationDocument = cachedDocUrl;
    }

    return data;
  }
}
