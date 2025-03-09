import { inject, injectable } from "tsyringe";
import { IClientEntity } from "../../../entities/models/client.entity";
import { IVendorEntity } from "../../../entities/models/vendor.entity";
import { IVendorRepository } from "../../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { LoginUserDto } from "../../../shared/dtos/user.dto";
import { ILoginStrategy } from "../interfaces/login-strategy.interface";
import { CustomError } from "../../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class VendorGoogleLoginStrategy implements ILoginStrategy {
    constructor(
        @inject("IVendorRepository") private vendorRepository : IVendorRepository
    ){}
    async login(data: any): Promise<IVendorEntity | null> {
        const vendor = await this.vendorRepository.findByEmail(data.email);

        if(vendor) {
            if(vendor.isblocked) {
                throw new CustomError(ERROR_MESSAGES.BLOCKED , HTTP_STATUS.FORBIDDEN)
            }
        }


        return vendor;
    }
}