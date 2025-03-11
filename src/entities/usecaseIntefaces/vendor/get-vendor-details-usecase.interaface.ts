import { IVendorEntity } from "../../models/vendor.entity";

export interface IGetVendorDetailsUsecase {
    execute(id : any) : Promise <IVendorEntity | null>
}