import { IVendor } from "../../models/vendor";
import { CreateCategoryRequestInput, CreateWorkSampleInput, GetServiceInput, GetWorkSampleInput, UpdatevendorProfileInput, UpdateWorkSampleInput } from "./types/vendor.types";
import { IService } from "../../models/service";
import { PaginatedResponse } from "./types/common.types";
import { IWorkSample } from "../../models/worksample";
import { Types } from "mongoose";

export interface IVendorProfileUsecase {
    updateVendorProfile(input : UpdatevendorProfileInput): Promise<IVendor>
    createCategoryJoinRequest(input : CreateCategoryRequestInput): Promise<void>
}

export interface IServiceCommandUsecase {
    createService(input : IService) : Promise<void>
    updateService(input : IService) : Promise<void>
    deleteService(serviceId : Types.ObjectId) : Promise<void>
    createWorkSample(input : CreateWorkSampleInput) : Promise<void>
    deleteWorkSmaple(workSampleId : Types.ObjectId) : Promise<void>
    updateWorkSample(input : UpdateWorkSampleInput): Promise<void>
}

export interface IServiceQueryUsecase {
    getServices(input : GetServiceInput) : Promise<PaginatedResponse<IService>>
    getWorkSmaples(input : GetWorkSampleInput) : Promise<PaginatedResponse<IWorkSample>>
}