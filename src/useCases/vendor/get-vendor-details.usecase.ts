import { inject, injectable } from "tsyringe";
import { IGetVendorDetailsUsecase } from "../../entities/usecaseInterfaces/vendor/get-vendor-details-usecase.interaface";
import { IVendorEntity } from "../../entities/models/vendor.entity";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IAwsS3Service } from "../../entities/services/awsS3-service.interface";
import { redisClient } from "../../frameworks/redis/redis.client";
import { config } from "../../shared/config";

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
      const cachedProfileUrl = await redisClient.get(`profile-url:${id}`);
      if (cachedProfileUrl) {
        data.profileImage = cachedProfileUrl;
      } else {
        const isFileAvailable = await this.awsS3Service.isFileAvailableInAwsBucket(data.profileImage);
        if (isFileAvailable) {
          const presignedUrl = await this.awsS3Service.getFileUrlFromAws(data.profileImage, config.redis.REDIS_PRESIGNED_URL_EXPIRY);
          data.profileImage = presignedUrl;
          await redisClient.setEx(`profile-url:${id}`, config.redis.REDIS_PRESIGNED_URL_EXPIRY, presignedUrl);
        }
      }
    }

    // Handle verificationDocument
    if (data?.verificationDocument) {
      const cachedDocUrl = await redisClient.get(`verification-doc-url:${id}`);
      if (cachedDocUrl) {
        data.verificationDocument = cachedDocUrl;
      } else {
        const isFileAvailable = await this.awsS3Service.isFileAvailableInAwsBucket(data.verificationDocument);
        if (isFileAvailable) {
          const presignedUrl = await this.awsS3Service.getFileUrlFromAws(data.verificationDocument, config.redis.REDIS_PRESIGNED_URL_EXPIRY);
          data.verificationDocument = presignedUrl;
          await redisClient.setEx(`verification-doc-url:${id}`, config.redis.REDIS_PRESIGNED_URL_EXPIRY, presignedUrl);
        }
      }
    }

    return data;
  }
}
