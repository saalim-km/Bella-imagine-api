import { inject, injectable } from "tsyringe";
import { IVendorProfileUsecase } from "../../domain/interfaces/usecase/vendor-usecase.interface";
import { IVendorRepository } from "../../domain/interfaces/repository/vendor.repository";
import { UpdatevendorProfileInput } from "../../domain/interfaces/usecase/types/vendor.types";
import { IVendor } from "../../domain/models/vendor";
import { CustomError } from "../../shared/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";
import { UpdateQuery } from "mongoose";
import { IAwsS3Service } from "../../domain/interfaces/service/aws-service.interface";
import { IGetPresignedUrlUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { config } from "../../shared/config/config";
import path from "path";
import { unlinkSync } from "fs";

@injectable()
export class VendorProfileUsecase implements IVendorProfileUsecase {
    constructor(
        @inject('IVendorRepository') private _vendorRepository : IVendorRepository,
        @inject('IAwsS3Service') private _awsService : IAwsS3Service,
        @inject('IGetPresignedUrlUsecase') private _presignedUrl : IGetPresignedUrlUsecase
    ){}

    async updateVendorProfile(input: UpdatevendorProfileInput): Promise<IVendor> {
        const {languages , location , name , vendorId , phoneNumber , portfolioWebsite, profileDescription, profileImage, verificationDocument} = input;
        const vendor = await this._vendorRepository.findById(vendorId)
        if(!vendor) {
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
        }

        const dataToUpdate : UpdateQuery<IVendor> = {
            name : name,
            location : location,
        }

        if(profileImage) {
            const isProfileImageExists = await this._awsService.isFileAvailableInAwsBucket(vendor.profileImage)
            if(isProfileImageExists){
                await this._awsService.deleteFileFromAws(vendor.profileImage)
            }

            const fileKey = `${config.s3.profile}/${vendorId}/${Date.now()}${path.extname(profileImage.originalname)}`;
            await this._awsService.uploadFileToAws(fileKey,profileImage.path)
            unlinkSync(profileImage.path)
            dataToUpdate.profileImage = fileKey;
        }

        if(verificationDocument){
            const isVerificationDocumentExists = await this._awsService.isFileAvailableInAwsBucket(vendor.verificationDocument);
            if(isVerificationDocumentExists){
                await this._awsService.deleteFileFromAws(vendor.verificationDocument)
            }   

          const fileKey = `${config.s3.vendorDocuments}/${vendorId}/${Date.now()}${path.extname(verificationDocument.originalname)}`;
          await this._awsService.uploadFileToAws(fileKey,verificationDocument.path);
          unlinkSync(verificationDocument.path);
          dataToUpdate.verificationDocument = fileKey;
        }

        if(languages && languages.length > 0 ) {
            dataToUpdate.languages = languages;
        }
        if(phoneNumber && phoneNumber !== undefined) {
            dataToUpdate.phoneNumber = phoneNumber;
        }
        if(portfolioWebsite && portfolioWebsite !== undefined) {
            dataToUpdate.portfolioWebsite = portfolioWebsite
        }
        if(profileDescription && profileDescription !== undefined) {
            dataToUpdate.description = profileDescription;
        }
        

        const updatedVendor = await this._vendorRepository.update(vendorId,dataToUpdate);
        if(!updatedVendor) {
            throw  new CustomError(ERROR_MESSAGES.USER_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
        }

        if(updatedVendor.profileImage) {
            updatedVendor.profileImage = await this._presignedUrl.getPresignedUrl(updatedVendor.profileImage)
        }
        if(updatedVendor.verificationDocument) {
            updatedVendor.verificationDocument = await this._presignedUrl.getPresignedUrl(updatedVendor.verificationDocument)
        }

        return updatedVendor
    }


    
}