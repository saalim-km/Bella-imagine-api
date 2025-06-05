import { inject, injectable } from "tsyringe";
import { IUpdateVendorRequestUsecase } from "../../domain/interfaces/usecase/admin-usecase.interface";
import { updateVendorRequestInput } from "../../domain/interfaces/usecase/types/admin.types";
import { IVendorRepository } from "../../domain/interfaces/repository/vendor-repository";

@injectable()
export class UpdateVendorRequestUsecase implements IUpdateVendorRequestUsecase {
    constructor(
        @inject("IVendorRepository") private _vendorRepository: IVendorRepository
    ){}

    async updateRequest(input: updateVendorRequestInput): Promise<void> {
        const status = input.status ? 'accept' : 'reject'
        await this._vendorRepository.update(input.id,{isVerified : status})
    }
}