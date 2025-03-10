import { ObjectId } from "mongoose";
import { IClientEntity } from "./client.entity";
import { TSlot } from "../../shared/types/vendor/slot.type";
import { TService } from "../../shared/types/vendor/service.type";

export interface IVendorEntity extends IClientEntity {
    vendorId ?: ObjectId,
    categories ?: ObjectId[];
    languages ?: string[];
    description ?: string;
    notifications ?: string[];
    availableSlots ?: TSlot[];
    services ?: TService[];
    isVerified ?: boolean
}