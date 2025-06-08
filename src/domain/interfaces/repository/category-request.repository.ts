import { ICategoryRequest } from "../../models/category-request";
import { GetCatRequestInput } from "../../types/admin.type";
import { PaginatedResponse } from "../usecase/types/common.types";
import { IBaseRepository } from "./base.repository";

export interface ICategoryRequestRepository extends IBaseRepository<ICategoryRequest>{
    findAllRequests(input : GetCatRequestInput) : Promise<PaginatedResponse<ICategoryRequest>>
}