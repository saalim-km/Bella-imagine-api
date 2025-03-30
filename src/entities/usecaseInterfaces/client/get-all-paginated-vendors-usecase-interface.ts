import { PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { IVendorsFilter } from "../../../shared/types/client/vendors-list.type";
import { IVendorEntity } from "../../models/vendor.entity";

export interface IGetAllPaginatedVendorsUsecase {
    execute(filters : IVendorsFilter) : Promise<PaginatedResponse<IVendorEntity>>
}