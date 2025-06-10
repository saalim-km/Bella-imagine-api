import { Types } from "mongoose";
import { IVendor } from "../../models/vendor";
import { GetVendorDetailsInput, GetVendorsQueryInput } from "./types/client.types";
import { PaginatedResponse } from "./types/common.types";
import { IService } from "../../models/service";

export interface IVendorBrowsingUseCase {
    fetchAvailableVendors(input : GetVendorsQueryInput) : Promise<PaginatedResponse<IVendor>>
    fetchVendorProfileById(input : GetVendorDetailsInput) : Promise<any>
    fetchVendorServiceForBooking(serviceId : Types.ObjectId) : Promise<IService>
}