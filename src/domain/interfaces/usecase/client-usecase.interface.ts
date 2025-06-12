import { Types } from "mongoose";
import { IVendor } from "../../models/vendor";
import { CreatePaymentIntentInput, GetVendorDetailsInput, GetVendorsQueryInput, UpdateClientProfileInput } from "./types/client.types";
import { PaginatedResponse } from "./types/common.types";
import { IService } from "../../models/service";
import { IClient } from "../../models/client";

export interface IVendorBrowsingUseCase {
    fetchAvailableVendors(input : GetVendorsQueryInput) : Promise<PaginatedResponse<IVendor>>
    fetchVendorProfileById(input : GetVendorDetailsInput) : Promise<any>
    fetchVendorServiceForBooking(serviceId : Types.ObjectId) : Promise<IService>
}


export interface IBookingCommandUsecase {
    createPaymentIntentAndBooking(input : CreatePaymentIntentInput) : Promise<string>
}

export interface IClientProfileUsecase {
    updateClientProfile(input : UpdateClientProfileInput) : Promise<IClient>
}