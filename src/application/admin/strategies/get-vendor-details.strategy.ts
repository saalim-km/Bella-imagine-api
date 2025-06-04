import { inject, injectable } from "tsyringe";
import { IGetUserDetailsStrategy } from "../../../domain/interfaces/usecase/admin-usecase.interface";
import { UserDetailsInput } from "../../../domain/interfaces/usecase/types/admin.types";
import { IVendorRepository } from "../../../domain/interfaces/repository/vendor-repository";
import { IGetPresignedUrlUsecase } from "../../../domain/interfaces/usecase/common-usecase.interfaces";
import { CustomError } from "../../../shared/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants/constants";
import { IVendor } from "../../../domain/models/vendor";

@injectable()
export class GetVendorDetailsStrategy implements IGetUserDetailsStrategy {
    constructor(
        @inject('IVendorRepository') private _vendorRepository : IVendorRepository,
        @inject('IGetPresignedUrlUsecase') private _getSigned : IGetPresignedUrlUsecase
    ){}

    async getDetails(input: UserDetailsInput): Promise<IVendor> {
        const vendor = await this._vendorRepository.findById(input.id)
        if(!vendor){
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND , HTTP_STATUS.BAD_REQUEST)
        }

        if(vendor.profileImage){
            vendor.profileImage = await this._getSigned.getPresignedUrl(vendor.profileImage)
        }

        if(vendor.verificationDocument){
            vendor.verificationDocument = await this._getSigned.getPresignedUrl(vendor.verificationDocument)
        }

        return vendor;
    }
}