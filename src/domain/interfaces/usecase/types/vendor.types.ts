import { Types } from "mongoose";
import { number } from "zod";
import { IService } from "../../../models/service";

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
  vendor : Types.ObjectId
  serviceTitle?: string;
  category?: Types.ObjectId;
  page: number;
  limit: number;
}


export interface CreateServiceInput extends Omit<IService , 'location'> {
  location : {
    lat : number,
    lng : number,
    address : string
  }
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

export interface GetWorkSampleInput {
  vendor : Types.ObjectId
  page : number;
  limit : number;
  title ?: string;
  isPublished ?: boolean;
  service ?: Types.ObjectId
}



export interface UpdateWorkSampleInput {
  _id : Types.ObjectId,
  service : Types.ObjectId
  vendor : Types.ObjectId
  title : string;
  description : string;
  tags : string[];
  isPublished : boolean;
  existingImageKeys ?: string[];
  deletedImageKeys ?: string[];
  newImages ?: Express.Multer.File[]
}