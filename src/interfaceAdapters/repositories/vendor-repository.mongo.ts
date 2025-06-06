import { injectable } from "tsyringe";
import { BaseUserRepository } from "./base-user-repository.mongo";
import { IVendor } from "../../domain/models/vendor";
import { Vendor } from "../database/schemas/vendor.schema";
import { IVendorRepository } from "../../domain/interfaces/repository/vendor.repository";

@injectable()
export class VendorRepository extends BaseUserRepository<IVendor> implements IVendorRepository {
    constructor(){
        super(Vendor)
    }
}