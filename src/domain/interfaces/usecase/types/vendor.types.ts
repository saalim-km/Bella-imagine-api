import { Types } from "mongoose";
import { number } from "zod";

export interface UpdatevendorProfileInput {
  vendorId: Types.ObjectId;
  name: string;
  phoneNumber?: number;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  profileImage?: Express.Multer.File;
  verificationDocument?: Express.Multer.File;
  languages?: string[];
  portfolioWebsite?: string;
  profileDescription?: string;
}

export interface CreateCategoryRequestInput {
  vendorId: Types.ObjectId;
  categoryId: Types.ObjectId;
}

export interface GetServiceInput {
  serviceTitle?: string;
  category?: Types.ObjectId;
  page: number;
  limit: number;
}

export interface CreateWorkSampleInput {
  service: Types.ObjectId;
  vendor: Types.ObjectId;
  title: string;
  description?: string;
  media: Express.Multer.File[];
  tags?: string[];
  isPublished : boolean
}