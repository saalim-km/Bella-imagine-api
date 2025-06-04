import { ObjectId } from "mongoose";
import { IBaseUserRepository } from "./base-user-repository";
import { PaginatedResult } from "../../../shared/types/pagination.types";
import { IService } from "../../models/service";
import { IVendor } from "../../models/vendor";
import { IBaseRepository } from "./base-repository";
import { IClient } from "../../models/client";

export interface IVendorRepository extends IBaseUserRepository<IVendor> , IBaseRepository<IVendor>{
    // findByIdAndUpdateVendorCategories(vendorId : ObjectId , categories : ObjectId[]) : Promise<void>
    // getPaginatedServices(vendorId : ObjectId , page : number , limit : number) : Promise<PaginatedResult<IService>>
    // getPaginatedWorkSamples(vendorId : ObjectId , page : number , limit : number) : Promise<PaginatedResult<IService>>
}