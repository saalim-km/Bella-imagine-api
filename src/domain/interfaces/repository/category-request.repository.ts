import { Types } from "mongoose";
import { ICategoryRequest } from "../../models/category-request";
import { GetCategoryInput, GetCatRequestInput } from "../../types/admin.type";
import { PaginatedResponse } from "../usecase/types/common.types";
import { IBaseRepository } from "./base.repository";
import { CreateCategoryRequestInput } from "../usecase/types/vendor.types";
import { isCatRequestExistsInput } from "../../types/vendor.types";

export interface ICategoryRequestRepository extends IBaseRepository<ICategoryRequest>{
    findAllRequests(input : GetCatRequestInput) : Promise<PaginatedResponse<ICategoryRequest>>
    isCategoryJoinRequestExists(input : isCatRequestExistsInput): Promise<boolean>;
}