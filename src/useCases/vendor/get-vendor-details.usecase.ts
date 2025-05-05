import { inject, injectable } from "tsyringe";
import { IGetVendorDetailsUsecase } from "../../entities/usecaseInterfaces/vendor/get-vendor-details-usecase.interaface";
import { IVendorEntity } from "../../entities/models/vendor.entity";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IAwsS3Service } from "../../entities/services/awsS3-service.interface";

@injectable()
export class GetVendorDetailUsecase implements IGetVendorDetailsUsecase {
    constructor(
        @inject("IVendorRepository") private vendorRepository : IVendorRepository,
        @inject("IAwsS3Service") private awsS3Service : IAwsS3Service
    ) {}
    async execute(id: any): Promise<IVendorEntity | null> {
        if(!id) {
            throw new Error('id is missing');
        }


        const data = await this.vendorRepository.findById(id);
        if(data?.profileImage) {
            const isFileAvailable = await this.awsS3Service.isFileAvailableInAwsBucket(data.profileImage)
            if(isFileAvailable) {
                data.profileImage = await this.awsS3Service.getFileUrlFromAws(data.profileImage , 604800)
            }
        }

        if(data?.verificationDocument) {
            const isFileAvailable = await this.awsS3Service.isFileAvailableInAwsBucket(data.verificationDocument)
            if(isFileAvailable) {
                data.verificationDocument = await this.awsS3Service.getFileUrlFromAws(data.verificationDocument, 604800)
            }
        }

        return data;
    }
}