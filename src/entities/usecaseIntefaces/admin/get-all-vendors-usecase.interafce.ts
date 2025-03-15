import { PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { IVendorEntity } from "../../models/vendor.entity";

export interface IGetAllVendorsUsecase {
    execute(filter : any , page ?: number , limit ?: number) : Promise<PaginatedResponse<IVendorEntity>>
}