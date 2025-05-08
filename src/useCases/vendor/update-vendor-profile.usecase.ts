import { inject, injectable } from "tsyringe";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IUpdateVendorProfileUsecase } from "../../entities/usecaseInterfaces/vendor/update-vendor-profile-usecase.interface";
import { UpdateVendorDto } from "../../shared/dtos/user.dto";
import { IVendorEntity } from "../../entities/models/vendor.entity";
import { IAwsS3Service } from "../../entities/services/awsS3-service.interface";
import { redisClient } from "../../frameworks/redis/redis.client";
import { unlinkSync } from "fs";
import path from "path";
import { config } from "../../shared/config";

@injectable()
export class UpdateVendorUsecase implements IUpdateVendorProfileUsecase {
    constructor(
        @inject("IVendorRepository") private vendorRepository: IVendorRepository,
        @inject("IAwsS3Service") private awsS3Service: IAwsS3Service
    ) {}

    async execute(id: any, data?: UpdateVendorDto, files?: { [key: string]: Express.Multer.File[] }): Promise<Partial<IVendorEntity>> {
        const vendor = await this.vendorRepository.findById(id);
        if (!vendor) throw new Error('vendor not found');
    
        // Handle profile image upload
        if (files?.profileImage?.[0]) {
          // Delete old image if it exists
          if (vendor.profileImage) {
            await this.awsS3Service.deleteFileFromAws(vendor.profileImage);
          }
        
          const profileFile = files.profileImage[0];
          const key = `profile-images/${id}/${Date.now()}${path.extname(profileFile.originalname)}`;
          await this.awsS3Service.uploadFileToAws(key, profileFile.path);
          data!.profileImage = key;
          try {
            unlinkSync(profileFile.path);
          } catch (e) {
            console.error('Failed to delete local file:', e);
          }
        }
    
        // Handle verification document upload
        if (files?.verificationDocument?.[0]) {
          // Delete old image if it exists
          if(vendor.verificationDocument) {
            await this.awsS3Service.deleteFileFromAws(vendor.verificationDocument)
          }

          const docFile = files.verificationDocument[0];
          const key = `vendor-documents/${id}/${Date.now()}${path.extname(docFile.originalname)}`;
          await this.awsS3Service.uploadFileToAws(key, docFile.path);
          data!.verificationDocument = key;
          unlinkSync(docFile.path);
        }
    
        // Apply updates
        if (data?.name !== undefined) vendor.name = data.name;
        if (data?.phoneNumber !== undefined) vendor.phoneNumber = data.phoneNumber;
        if (data?.profileImage !== undefined) vendor.profileImage = data.profileImage;
        if (data?.location !== undefined) vendor.location = data.location;
        if (data?.languages !== undefined) vendor.languages = data.languages;
        if (data?.profileDescription !== undefined) vendor.description = data.profileDescription;
        if (data?.portfolioWebsite !== undefined) vendor.portfolioWebsite = data.portfolioWebsite;
        if (data?.verificationDocument !== undefined) vendor.verificationDocument = data.verificationDocument;
    
        const updatedVendor = await this.vendorRepository.updateVendorProfile(id, vendor);
    
        console.log('updated vendor : ',updatedVendor);
        // Caching pre-signed profile image
        if (updatedVendor?.profileImage) {
          const isFileAvailable = await this.awsS3Service.isFileAvailableInAwsBucket(updatedVendor.profileImage);
          if (isFileAvailable) {
            const url = await this.awsS3Service.getFileUrlFromAws(updatedVendor.profileImage, config.redis.REDIS_PRESIGNED_URL_EXPIRY);
            updatedVendor.profileImage = url;
            await redisClient.setEx(`profile-url:${id}`, config.redis.REDIS_PRESIGNED_URL_EXPIRY, url);
          }
        }
    
        // Caching pre-signed verification document
        if (updatedVendor?.verificationDocument) {
          const isFileAvailable = await this.awsS3Service.isFileAvailableInAwsBucket(updatedVendor.verificationDocument);
          if (isFileAvailable) {
            const url = await this.awsS3Service.getFileUrlFromAws(updatedVendor.verificationDocument, 86400);
            updatedVendor.verificationDocument = url;
            await redisClient.setEx(`verification-doc-url:${id}`, config.redis.REDIS_PRESIGNED_URL_EXPIRY, url);
          }
        }
    
        if (!updatedVendor) {
          throw new Error('Failed to update vendor profile');
        }

        return {
          name: updatedVendor.name,
          phoneNumber: updatedVendor.phoneNumber,
          profileImage: updatedVendor.profileImage,
          location: updatedVendor.location,
          languages: updatedVendor.languages,
          description: updatedVendor.description,
          portfolioWebsite: updatedVendor.portfolioWebsite,
          verificationDocument: updatedVendor.verificationDocument,
        };
      }
}
