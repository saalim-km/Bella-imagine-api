import { IBookingModel } from "../../../frameworks/database/models/booking.model";
import { TRole } from "../../../shared/constants";
import {
  BookingListFromRepo,
  IBookingEntity,
  TPaymentStatus,
} from "../../models/booking.entity";
import { IClientEntity } from "../../models/client.entity";
import { IVendorEntity } from "../../models/vendor.entity";

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

  findByIdAndUpdatePaymentStatus(id: any, status: TPaymentStatus): Promise<void>;

  findByIdAndUpdateBookingStatus(id: any, status: string): Promise<void>;

  findByPaymentIdAndUpdateBookingStatus(paymentId: any, status: string): Promise<void>;

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

  findByClientId(clientId: any): Promise<IBookingEntity[]>;

  findByVendorId(vendorId: any): Promise<IBookingEntity[]>;

  findContactsForChat(userId : string , userType : TRole) : Promise<IVendorEntity[] | IClientEntity[] | null>
}
