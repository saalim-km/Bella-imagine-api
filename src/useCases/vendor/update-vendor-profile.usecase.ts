import { inject, injectable } from "tsyringe";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IUpdateVendorProfileUsecase } from "../../entities/usecaseIntefaces/vendor/update-vendor-profile-usecase.interface";
import { UpdateVendorDto } from "../../shared/dtos/user.dto";

@injectable()
export class UpdateVendorUsecase implements IUpdateVendorProfileUsecase {
    constructor(
        @inject("IVendorRepository") private vendorRepository : IVendorRepository
    ){}
    async execute(id: any, data: UpdateVendorDto): Promise<void> {
        console.log('----------------------updateVendorUseCase-----------------------------');
        console.log(id,data);
        const {name,profileImage,location,phoneNumber} = data;

        if (!name || !profileImage || !location || !phoneNumber) {
            throw new Error('Data for updating is missing');
        }

        const vendor = await this.vendorRepository.findById(id);
        console.log('vendor data : ',vendor);
        if (!vendor) {
            throw new Error('vendor not found');
        }

        vendor.name = name;
        vendor.phoneNumber = phoneNumber;
        vendor.profileImage = profileImage;
        vendor.location = location;
        vendor.languages = data.languages;
        vendor.description = data.profileDescription;
        vendor.portfolioWebsite = data.portfolioWebsite


        const result = await this.vendorRepository.updateVendorProfile(id , vendor);
        console.log('updated vendor profile',result);
    }
}