import { ObjectId } from "mongoose";
import { TBookingStatus, TPaymentStatus } from "../shared/types/booking.types";

export interface IBookingEntity {
  _id: ObjectId;
  userId: ObjectId;
  vendorId: ObjectId;

  paymentId: ObjectId;

  isClientApproved: boolean;
  isVendorApproved: boolean;

  serviceDetails: {
    _id: ObjectId;
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
  totalPrice: number;
  paymentStatus: TPaymentStatus;
  status: TBookingStatus;

  createdAt?: Date;
  updatedAt?: Date;
}
