import { ObjectId } from "mongoose";
import { IClientEntity } from "./client.entity";
import { TSlot } from "../../shared/types/vendor/slot.type";
import { TService } from "../../shared/types/vendor/service.type";

export interface IVendorEntity extends IClientEntity {
    vendorId ?: string,
    portfolioWebsite : string;
    categories ?: ObjectId[];
    languages ?: string[];
    description ?: string;
    verificationDocuments ?: string[];
    isVerified ?: 'pending' | 'accept' | 'reject'
}