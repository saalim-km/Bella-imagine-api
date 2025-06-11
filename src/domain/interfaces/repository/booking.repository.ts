import { Types } from "mongoose";
import { IBooking } from "../../models/booking";
import { IBaseRepository } from "./base.repository";
import { PaymentStatus } from "../../models/payment";

export interface IBookingRepository extends IBaseRepository<IBooking> {
    findByIdAndUpdatePaymentStatus(bookingId : Types.ObjectId , status : PaymentStatus) : Promise<void>
}