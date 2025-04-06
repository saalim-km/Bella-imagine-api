import { PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { IWorkSampleFilter } from "../../../shared/types/vendor/work-sample.types";
import { IWorkSampleEntity } from "../../models/work-sample.entity";

export interface IWorkSampleRepository {
    create (data : Partial<IWorkSampleEntity>) : Promise<IWorkSampleEntity  >

    findWorkSampleById(workSampleId : string) : Promise<IWorkSampleEntity | null>

    findAllWorkSampleByVendor (filter : IWorkSampleFilter , skip :  number , limit : number , sort ?: any) : Promise<PaginatedResponse<IWorkSampleEntity>>;

    deleteWorkSampleById(workSampleId : string) : Promise<void>

    updateWorkSampleById(workSampleId : string , payload : Partial<IWorkSampleEntity>) : Promise<void>
}