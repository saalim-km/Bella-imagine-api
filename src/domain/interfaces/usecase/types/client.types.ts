import { Types } from "mongoose";
import { PaginationInput } from "./admin.types";

export interface GetVendorsQueryInput extends Pick<PaginationInput , 'limit'|'page'> {
    location ?: string;
    languages ?: string;
    category ?: Types.ObjectId
}

export interface GetVendorDetailsInput {
    vendorId : Types.ObjectId
    samplePage : number;
    servicePage : number;
    serviceLimit : number;
    sampleLimit : number;
}