import { Types } from "mongoose";

export interface UpdatevendorProfileInput {
  vendorId : Types.ObjectId;
  name: string;
  phoneNumber?: number;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  profileImage ?: Express.Multer.File 
  verificationDocument ?: Express.Multer.File 
  languages ?: string[];
  portfolioWebsite ?: string;
  profileDescription ?: string;
}   

export interface CreateCategoryRequestInput {
  vendorId: Types.ObjectId;
  categoryId: Types.ObjectId;
}