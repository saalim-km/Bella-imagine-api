import { PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { IWorkSampleFilter } from "../../../shared/types/vendor/work-sample.types";
import { IWorkSampleEntity } from "../../models/work-sample.entity";

export interface IGetPaginatedWorkSampleUsecase {
    execute(filter : IWorkSampleFilter, limit : number , page : number , vendorId : string) : Promise<PaginatedResponse<IWorkSampleEntity>>
}