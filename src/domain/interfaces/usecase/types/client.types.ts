import { Types } from "mongoose";
import { PaginationInput } from "./admin.types";

export interface GetVendorsQueryInput
  extends Pick<PaginationInput, "limit" | "page"> {
  location?: string;
  languages?: string;
  category?: Types.ObjectId;
}

export interface GetVendorDetailsInput {
  vendorId: Types.ObjectId;
  samplePage: number;
  servicePage: number;
  serviceLimit: number;
  sampleLimit: number;
}

export interface CreatePaymentIntenServicetInput {
  amount: number;
  currency: string;
  description: string;
  receiptEmail: string;
  metadata : {
    bookingId : string;
    vendorId : string;
    clientId : string;
  }
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
  createrType: string;
  receiverType: string;
  distance?: number;
  customLocation?: string;
  travelTime?: string;
  travelFee?: number;
  totalPrice: number;
}
