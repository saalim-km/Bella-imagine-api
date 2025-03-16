import { PaginatedRequestUser, PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { IVendorEntity } from "../../models/vendor.entity";

export interface IGetPendingVendorRequestUsecase {
    execute(filters ?: PaginatedRequestUser , page ?: number , limit ?: number) : Promise<PaginatedResponse<IVendorEntity>>
}