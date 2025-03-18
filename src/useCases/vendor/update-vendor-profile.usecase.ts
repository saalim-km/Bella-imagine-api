import { inject, injectable } from "tsyringe";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IUpdateVendorProfileUsecase } from "../../entities/usecaseInterfaces/vendor/update-vendor-profile-usecase.interface";
import { UpdateVendorDto } from "../../shared/dtos/user.dto";

@injectable()
export class UpdateVendorUsecase implements IUpdateVendorProfileUsecase {
    constructor(
        @inject("IVendorRepository") private vendorRepository : IVendorRepository
    ){}
    async execute(id: any, data ?: UpdateVendorDto): Promise<void> {
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

        const result = await this.vendorRepository.updateVendorProfile(id, vendor);
        console.log('updated vendor profile', result);
    }
}