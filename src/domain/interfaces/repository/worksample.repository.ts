import { FilterQuery, SortOrder } from "mongoose";
import { IWorkSample } from "../../models/worksample";
import { PaginatedResponse } from "../usecase/types/common.types";
import { IBaseRepository } from "./base.repository";

export interface IWorksampleRepository extends IBaseRepository<IWorkSample> {
    getWorkSamples(filter: FilterQuery<IWorkSample>, skip: number, limit: number , sort ?: SortOrder) : Promise<PaginatedResponse<IWorkSample>>
}