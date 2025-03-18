import mongoose, { Document, ObjectId } from "mongoose";
import { IVendorEntity } from "../../../entities/models/vendor.entity";
import { vendorSchema } from "../schemas/vendor.schema";

export interface IVendorModel extends Omit<IVendorEntity , "_id"> , Document {
    _id : ObjectId;
}

export const VendorModel =  mongoose.model('Vendor',vendorSchema)