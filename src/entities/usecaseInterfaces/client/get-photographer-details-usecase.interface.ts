import { IVendorEntity } from "../../models/vendor.entity";

export interface IGetPhotographerDetailsUsecase {
    execute (vendorId : string) : Promise<IVendorEntity | null>
}