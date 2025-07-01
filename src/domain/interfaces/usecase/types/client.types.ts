import { Types } from "mongoose";
import { PaginationInput } from "./admin.types";
import { TRole } from "../../../../shared/constants/constants";
import { BookingQueryParams } from "../../../../shared/utils/zod-validations/presentation/client.schema";
import { TBookingStatus, TPaymentStatus } from "../../../../shared/types/booking.types";
import { IVendor } from "../../../models/vendor";
import { IWorkSample } from "../../../models/worksample";
import { IService } from "../../../models/service";

export interface GetVendorsQueryInput
  extends Pick<PaginationInput, "limit" | "page"> {
  location?: {lat : number , lng : number};
  languages?: string[];
  categories?: Types.ObjectId[];
  minCharge?: number;
  maxCharge?: number;
  tags?: string[];
  services?: Types.ObjectId[];
  sortBy?: Record<string,number>
}

export interface GetVendorDetailsInput {
  vendorId: Types.ObjectId;
  samplePage: number;
  servicePage: number;
  serviceLimit: number;
  sampleLimit: number;
}


export interface CreatePaymentIntentInput {
  vendorId: Types.ObjectId;
  clientId: Types.ObjectId;
  serviceId: Types.ObjectId;
  bookingDate: string;
  timeSlot: {
    startTime: string;
    endTime: string;
  };
  location ?: {
    lat?: number;
    lng?: number;
  };
  purpose: 'vendor-booking';
  createrType: "Client" | "Vendor";
  receiverType: "Client" | "Vendor";
  distance?: number;
  customLocation?: string;
  travelTime?: string;
  travelFee?: number;
  totalPrice: number;
}


export interface UpdateClientProfileInput{
  clientId : Types.ObjectId;
  name: string;
  phoneNumber?: number;
  location ?: {
    address?: string;
    lat?: number;
    lng?: number;
  };
  profileImage?: Express.Multer.File  
  email: string;
}

export interface GetAllBookingsInput {
  userId : Types.ObjectId;
  role : TRole;
  query : BookingQueryParams
}

export interface updateBookingStatusInput {
  bookingId: Types.ObjectId;
  status: TBookingStatus;
  userId : Types.ObjectId;
}

export interface GetVendorsOutput extends Omit<IVendor , 'workSamples' | 'services'>{
  workSamples : IWorkSample[]
  services : IService[]
}