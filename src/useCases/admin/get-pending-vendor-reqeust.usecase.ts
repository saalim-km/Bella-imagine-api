import { inject } from "tsyringe";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IGetPendingVendorRequestUsecase } from "../../entities/usecaseIntefaces/admin/get-pending-vendor-request-usecase.interface";
import { IVendorEntity } from "../../entities/models/vendor.entity";

export class GetPendingVendorRequestUsecase implements IGetPendingVendorRequestUsecase {
    constructor(
        @inject("IVendorRepository") private vendorRepository : IVendorRepository
    ){}

    async execute(): Promise<IVendorEntity[]> {
        // const pendingVendors = await this.vendorRepository.find( {isVerified : false}, )
    }
}