import { ICategoryRequest } from "../../models/category-request";
import { PaginatedResponse } from "../usecase/types/common.types";
import { IBaseRepository } from "./base.repository";
import { isCatRequestExistsInput } from "../../types/vendor.types";
import { GetCatRequestInput } from "../../types/admin.type";

export interface ICategoryRequestRepository extends IBaseRepository<ICategoryRequest>{
    findAllRequests(input : GetCatRequestInput) : Promise<PaginatedResponse<ICategoryRequest>>
    isCategoryJoinRequestExists(input : isCatRequestExistsInput): Promise<boolean>;
}