import { Types } from "mongoose";
import { IBooking } from "../../models/booking";
import { IBaseRepository } from "./base.repository";
import { PaymentStatus } from "../../models/payment";
import { BookingQueryParams } from "../../../shared/utils/zod-validations/presentation/client.schema";
import { PaginatedResponse } from "../usecase/types/common.types";

export interface FindBookingsInput extends BookingQueryParams {
  userId?: Types.ObjectId;
  vendorId?: Types.ObjectId;
}


export interface IBookingRepository extends IBaseRepository<IBooking> {
    findByIdAndUpdatePaymentStatus(bookingId : Types.ObjectId , status : PaymentStatus) : Promise<void>
    findBookings(input: FindBookingsInput): Promise<PaginatedResponse<IBooking>>
}