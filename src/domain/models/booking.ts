import { Types } from "mongoose";
import { TBookingStatus, TPaymentStatus } from "../../shared/types/booking.types";

export interface IBooking {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  vendorId: Types.ObjectId;
  paymentId: Types.ObjectId | null;

  isClientApproved: boolean;
  isVendorApproved: boolean;

  serviceDetails: {
    _id: Types.ObjectId;
    serviceTitle: string;
    serviceDescription: string;
    cancellationPolicies: string[];
    termsAndConditions: string[];
    location : {
      lat : number;
      lng : number;
      address : string;
    }
  };

  bookingDate: string;
  timeSlot: {
    startTime: string;
    endTime: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  adminCommision ?: number;
  distance ?: number
  travelTime ?: string
  totalPrice: number;
  travelFee ?: number
  paymentStatus: TPaymentStatus;
  status: TBookingStatus;
  customLocation ?: string
  createrType?: "Client" | "Vendor";
  receiverType?: "Client" | "Vendor";
  createdAt?: Date;
  updatedAt?: Date;
}