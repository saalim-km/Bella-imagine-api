import { IVendor } from "../../models/vendor";
import { UpdatevendorProfileInput } from "./types/vendor.types";

export interface IVendorProfileUsecase {
    updateVendorProfile(input : UpdatevendorProfileInput): Promise<IVendor>
}