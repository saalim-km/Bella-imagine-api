import { IBookingModel } from "../../../frameworks/database/models/booking.model";
import {
  BookingListFromRepo,
  IBookingEntity,
} from "../../models/booking.entity";

export interface IBookingRepository {
  findByUserId(
    filter: any,
    sort: any,
    skip: number,
    limit: number
  ): Promise<BookingListFromRepo>;

  save(data: Partial<IBookingEntity>): Promise<IBookingEntity | null>;

  findById(id: any): Promise<IBookingEntity | null>;

  findByIdAndUpdatePaymentId(id: any, paymentId: any): Promise<void>;

  findByIdAndUpdatePaymentStatus(id: any, status: string): Promise<void>;

  findByIdAndUpdateBookingStatus(id: any, status: string): Promise<void>;

  findByClientIdAndVendorId(
    clientId: any,
    vendorId: any
  ): Promise<IBookingEntity | null>;

  updateClientApproved(id: any): Promise<IBookingEntity | null>;

  updateVendorApproved(id: any): Promise<IBookingEntity | null>;

  isBothApproved(bookingId: any): Promise<IBookingEntity | null>;

  find(
    filter: any,
    sort: any,
    skip: number,
    limit: number
  ): Promise<BookingListFromRepo>;

  // latest for chat
  findByClientId(clientId: any): Promise<IBookingEntity[]>;

  findByVendorId(vendorId: any): Promise<IBookingEntity[]>;
}
