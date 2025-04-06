import { IServiceEntity } from "../../models/service.entity";
import { PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { IServiceFilter } from "../../../shared/types/vendor/service.type";

export interface IGetAllPaginatedServicesUsecase {
    execute(filter : IServiceFilter, limit : number , page : number , vendorId : string) : Promise<PaginatedResponse<IServiceEntity>>
}