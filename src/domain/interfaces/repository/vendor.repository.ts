import { Types } from "mongoose";
import { IBaseUserRepository } from "./base-user.repository";
import { PaginatedResult } from "../../../shared/types/pagination.types";
import { IService } from "../../models/service";
import { IVendor } from "../../models/vendor";
import { IBaseRepository } from "./base.repository";
import { GetQueryInput } from "../../types/admin.type";
import { PaginatedResponse } from "../usecase/types/common.types";
import { IClient } from "../../models/client";
import { ClientVendorQuery } from "../../types/client.types";
import { IWorkSample } from "../../models/worksample";
import { GetVendorsOutput } from "../usecase/types/client.types";

export interface IVendorRepository extends IBaseUserRepository<IVendor> , IBaseRepository<IVendor>{
    findAllVendors(input : GetQueryInput) : Promise<PaginatedResponse<IVendor>>
    fetchVendorListingsForClients(input : ClientVendorQuery) : Promise<PaginatedResponse<GetVendorsOutput>>
    // findByIdAndUpdateVendorCategories(vendorId : Types.ObjectId , categories : Types.ObjectId[]) : Promise<void>
    getPaginatedServices(vendorId : Types.ObjectId , page : number , limit : number) : Promise<PaginatedResult<IService>>
    getPaginatedWorkSamples(vendorId : Types.ObjectId , page : number , limit : number) : Promise<PaginatedResult<IWorkSample>>
    findVendorDetailsById(vendorId : Types.ObjectId) : Promise<IVendor | null>
}