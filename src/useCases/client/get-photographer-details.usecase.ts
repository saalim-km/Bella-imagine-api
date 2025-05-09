import { inject, injectable } from "tsyringe";
import { IGetPhotographerDetailsUsecase } from "../../entities/usecaseInterfaces/client/get-photographer-details-usecase.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IVendorEntity } from "../../entities/models/vendor.entity";
import { CustomError } from "../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { s3UrlCache } from "../../frameworks/di/resolver";

@injectable()
export class GetPhotographerDetailsUsecase implements IGetPhotographerDetailsUsecase {
    constructor(
        @inject("IVendorRepository") private vendorRepository : IVendorRepository
    ){}

    async execute(vendorId: string): Promise<IVendorEntity | null> {
        if(!vendorId) {
            throw new CustomError('vendorid is required',HTTP_STATUS.BAD_REQUEST);
        }

        const vendor = await this.vendorRepository.findById(vendorId)
    
        if(!vendor){
            throw new CustomError(ERROR_MESSAGES.VENDOR_NOT_FOUND,HTTP_STATUS.BAD_REQUEST)
        }

        if(vendor.profileImage){
            const cachedUrl = await s3UrlCache.getCachedSignUrl(vendor.profileImage)
            vendor.profileImage = cachedUrl;
        }

        return vendor;
    }
}