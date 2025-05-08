import { ObjectId } from "mongoose";
import { IClientEntity } from "./client.entity";

export interface IVendorEntity extends IClientEntity {
    vendorId ?: string,
    portfolioWebsite : string;
    categories ?: ObjectId[];
    languages ?: string[];
    description ?: string;
    verificationDocument ?: string;
    isVerified ?: 'pending' | 'accept' | 'reject'
    services : string[]
    workSamples : string[]
}