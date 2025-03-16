import { inject, injectable } from "tsyringe";
import { IGetVendorDetailsUsecase } from "../../entities/usecaseInterfaces/vendor/get-vendor-details-usecase.interaface";
import { IVendorEntity } from "../../entities/models/vendor.entity";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";

@injectable()
export class GetVendorDetailUsecase implements IGetVendorDetailsUsecase {
    constructor(
        @inject("IVendorRepository") private vendorRepository : IVendorRepository
    ) {}
    async execute(id: any): Promise<IVendorEntity | null> {
        console.log('------------------------vendor details usecase----------------------');
        if(!id) {
            throw new Error('id is missing');
        }

        return await this.vendorRepository.findById(id);
    }
}