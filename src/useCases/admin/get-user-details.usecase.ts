import { inject, injectable } from "tsyringe";
import { IGetUserDetailsUsecase } from "../../entities/usecaseInterfaces/admin/get-user-details-usecase.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { ObjectId } from "mongoose";
import { IClientEntity } from "../../entities/models/client.entity";
import { IVendorEntity } from "../../entities/models/vendor.entity";
import { TRole } from "../../shared/constants";

@injectable()
export class GetUserDetailsUsecase implements IGetUserDetailsUsecase {
    constructor(
        @inject("IClientRepository") private clientRepository : IClientRepository,
        @inject("IVendorRepository") private vendorRepository : IVendorRepository
    ){}

    async execute(userId: string | ObjectId, role: TRole): Promise<IClientEntity | IVendorEntity> {
        if (role === "client") {
            const client = await this.clientRepository.findById(userId);
            if (!client) {
            throw new Error("Client not found");
            }
            return client;
        } else if (role === "vendor") {
            const vendor = await this.vendorRepository.findById(userId);
            if (!vendor) {
            throw new Error("Vendor not found");
            }
            return vendor;
        } else {
            throw new Error("Invalid role");
        }
    }
}