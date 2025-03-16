import { IVendorEntity } from "../../models/vendor.entity";

export interface IGetPendingVendorRequestUsecase {
    execute(filter : any,skip : number,limit : number) : Promise<IVendorEntity[]>
}