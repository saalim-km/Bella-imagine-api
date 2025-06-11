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
  distance ?: number
  
  totalPrice: number;
  travelFee ?: number
  paymentStatus: TPaymentStatus;
  status: TBookingStatus;
  customLocation ?: string
  createdAt?: Date;
  updatedAt?: Date;
}