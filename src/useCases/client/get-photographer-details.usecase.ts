import { inject, injectable } from "tsyringe";
import { IGetPhotographerDetailsUsecase } from "../../entities/usecaseInterfaces/client/get-photographer-details-usecase.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IVendorEntity } from "../../entities/models/vendor.entity";
import { CustomError } from "../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../shared/constants";

@injectable()
export class GetPhotographerDetailsUsecase implements IGetPhotographerDetailsUsecase {
    constructor(
        @inject("IVendorRepository") private vendorRepository : IVendorRepository
    ){}

    async execute(vendorId: string): Promise<IVendorEntity | null> {
        if(!vendorId) {
            throw new CustomError('vendorid is required',HTTP_STATUS.BAD_REQUEST);
        }

        return await this.vendorRepository.findById(vendorId)
    }
}