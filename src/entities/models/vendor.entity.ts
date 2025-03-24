import { ObjectId } from "mongoose";
import { IClientEntity } from "./client.entity";

export interface IVendorEntity extends IClientEntity {
    vendorId ?: string,
    portfolioWebsite : string;
    categories ?: ObjectId[];
    languages ?: string[];
    description ?: string;
    verificationDocuments ?: string[];
    isVerified ?: 'pending' | 'accept' | 'reject'
}