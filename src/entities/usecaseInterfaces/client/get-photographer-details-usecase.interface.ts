import { IVendorEntity } from "../../models/vendor.entity";

export interface IGetPhotographerDetailsUsecase {
    execute (vendorId: string, servicePage : number, serviceLimit : number, samplePage : number, sampleLimit : number) : Promise<IVendorEntity | null>
}