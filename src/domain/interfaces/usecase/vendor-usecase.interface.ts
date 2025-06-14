import { Types } from "mongoose";
import { ICategory } from "../../models/category";
import { IVendor } from "../../models/vendor";
import { PopulatedWallet } from "../../models/wallet";
import { CreateCategoryRequestInput, UpdatevendorProfileInput } from "./types/vendor.types";

export interface IVendorProfileUsecase {
    updateVendorProfile(input : UpdatevendorProfileInput): Promise<IVendor>
    createCategoryJoinRequest(input : CreateCategoryRequestInput): Promise<void>
}