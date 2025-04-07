import { ObjectId } from "mongoose";

export interface IBookingEntity {
  _id?: string | ObjectId;
  userId?: string | ObjectId;
  vendorId?: string | ObjectId;

  paymentId?: string | ObjectId;

  isClientApproved: boolean;
  isVendorApproved: boolean;

  serviceDetails: {
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

  totalPrice: number;
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  status: "pending" | "confirmed" | "cancelled" | "completed";

  createdAt: Date;
}

export interface  Booking {
  vendorId: any;

  serviceId: any;

  bookingDate: string;
  timeSlot: {
    startTime: string;
    endTime: string;
  };

  totalPrice: number;
}

export interface BookingListData {
  _id: string | ObjectId;
  clientName: string;
  serviceRequired: string;
  requiredDate: string;
  totalPrice: number;
  status: string;
}

export interface BookingListFromRepo {
  bookings: IBookingEntity[];
  total: number;
}

export interface BookingListFromUseCase {
  bookings: BookingListData[];
  total: number;
}
