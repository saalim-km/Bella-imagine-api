import { Types } from "mongoose";
import { IBaseUserRepository } from "./base-user.repository";
import { PaginatedResult } from "../../../shared/types/pagination.types";
import { IService } from "../../models/service";
import { IVendor } from "../../models/vendor";
import { IBaseRepository } from "./base.repository";

export interface IVendorRepository extends IBaseUserRepository<IVendor> , IBaseRepository<IVendor>{
    // findByIdAndUpdateVendorCategories(vendorId : Types.ObjectId , categories : Types.ObjectId[]) : Promise<void>
    // getPaginatedServices(vendorId : Types.ObjectId , page : number , limit : number) : Promise<PaginatedResult<IService>>
    // getPaginatedWorkSamples(vendorId : Types.ObjectId , page : number , limit : number) : Promise<PaginatedResult<IService>>
}