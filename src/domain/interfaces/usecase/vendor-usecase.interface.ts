import { IVendor } from "../../models/vendor";
import { CreateCategoryRequestInput, CreateWorkSampleInput, GetServiceInput, UpdatevendorProfileInput } from "./types/vendor.types";
import { IService } from "../../models/service";
import { PaginatedResponse } from "./types/common.types";
import { IWorkSample } from "../../models/worksample";

export interface IVendorProfileUsecase {
    updateVendorProfile(input : UpdatevendorProfileInput): Promise<IVendor>
    createCategoryJoinRequest(input : CreateCategoryRequestInput): Promise<void>
}

export interface IServiceCommandUsecase {
    createService(input : IService) : Promise<void>
    updateService(input : IService) : Promise<void>
    createWorkSample(input : CreateWorkSampleInput) : Promise<void>
}

export interface IServiceQueryUsecase {
    getServices(input : GetServiceInput) : Promise<PaginatedResponse<IService>>
}