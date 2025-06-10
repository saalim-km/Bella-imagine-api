import { IVendor } from "../../models/vendor";
import { GetVendorDetailsInput, GetVendorsQueryInput } from "./types/client.types";
import { PaginatedResponse } from "./types/common.types";

export interface IVendorBrowsingUseCase {
    fetchAvailableVendors(input : GetVendorsQueryInput) : Promise<PaginatedResponse<IVendor>>
    fetchVendorProfileById(input : GetVendorDetailsInput) : Promise<any>
}