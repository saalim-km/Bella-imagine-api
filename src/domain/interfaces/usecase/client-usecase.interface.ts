import { Types } from "mongoose";
import { GetVendorDetailsInput, GetVendorsOutput, GetVendorsQueryInput, UpdateClientProfileInput } from "./types/client.types";
import { PaginatedResponse } from "./types/common.types";
import { IService } from "../../models/service";
import { IClient } from "../../models/client";

export interface IVendorBrowsingUseCase {
    fetchAvailableVendors(input : GetVendorsQueryInput) : Promise<PaginatedResponse<GetVendorsOutput>>
    fetchVendorProfileById(input : GetVendorDetailsInput) : Promise<any>
    fetchVendorServiceForBooking(serviceId : Types.ObjectId) : Promise<IService>
}




export interface IClientProfileUsecase {
    updateClientProfile(input : UpdateClientProfileInput) : Promise<IClient>
}
