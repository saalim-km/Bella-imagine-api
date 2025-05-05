import { inject, injectable } from "tsyringe";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IUpdateVendorProfileUsecase } from "../../entities/usecaseInterfaces/vendor/update-vendor-profile-usecase.interface";
import { UpdateVendorDto } from "../../shared/dtos/user.dto";
import { IVendorEntity } from "../../entities/models/vendor.entity";
import { PutBucketAccelerateConfigurationRequest } from "@aws-sdk/client-s3";
import { IAwsS3Service } from "../../entities/services/awsS3-service.interface";

@injectable()
export class UpdateVendorUsecase implements IUpdateVendorProfileUsecase {
    constructor(
        @inject("IVendorRepository") private vendorRepository : IVendorRepository,
        @inject("IAwsS3Service") private awsS3Service : IAwsS3Service
        
    ){}
    async execute(id: any, data ?: UpdateVendorDto): Promise<Partial<IVendorEntity>> {
        console.log('----------------------updateVendorUseCase-----------------------------');
        console.log(id, data);

        const vendor = await this.vendorRepository.findById(id);
        console.log('vendor data : ', vendor);
        if (!vendor) {
            throw new Error('vendor not found');
        }

        if (data?.name !== undefined) {
            vendor.name = data.name;
        }
        if (data?.phoneNumber !== undefined) {
            vendor.phoneNumber = data.phoneNumber;
        }
        if (data?.profileImage !== undefined) {
            vendor.profileImage = data.profileImage;
        }
        if (data?.location !== undefined) {
            vendor.location = data.location;
        }
        if (data?.languages !== undefined) {
            vendor.languages = data.languages;
        }
        if (data?.profileDescription !== undefined) {
            vendor.description = data.profileDescription;
        }
        if (data?.portfolioWebsite !== undefined) {
            vendor.portfolioWebsite = data.portfolioWebsite;
        }
        if(data?.verificationDocument !== undefined){
            vendor.verificationDocument = data?.verificationDocument;
        }

        console.log('final vendor data before update: ',vendor);
        const updatedVendor = await this.vendorRepository.updateVendorProfile(id, vendor);
        console.log('updated vendor profile', updatedVendor);
        

        if(updatedVendor?.profileImage) {
            const isFileAvailable = await this.awsS3Service.isFileAvailableInAwsBucket(updatedVendor.profileImage)
            if(isFileAvailable) {
                updatedVendor.profileImage = await this.awsS3Service.getFileUrlFromAws(updatedVendor.profileImage , 604800)
            }
        }

        if(updatedVendor?.verificationDocument) {
            const isFileAvailable = await this.awsS3Service.isFileAvailableInAwsBucket(updatedVendor.verificationDocument)
            if(isFileAvailable) {
                updatedVendor.verificationDocument = await this.awsS3Service.getFileUrlFromAws(updatedVendor.verificationDocument, 604800)
            }
        }

        const dto : Partial<IVendorEntity> = {
            name : updatedVendor?.name,
            phoneNumber : updatedVendor?.phoneNumber,
            profileImage : updatedVendor?.profileImage,
            location : updatedVendor?.location,
            languages : updatedVendor?.languages,
            description : updatedVendor?.description,
            portfolioWebsite : updatedVendor?.portfolioWebsite,
            verificationDocument : updatedVendor?.verificationDocument
        
        }

        return dto
    }
}