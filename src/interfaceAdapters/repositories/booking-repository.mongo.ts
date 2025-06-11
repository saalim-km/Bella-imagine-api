import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { IBooking } from "../../domain/models/booking";
import { IBookingRepository } from "../../domain/interfaces/repository/booking.repository";
import { Booking } from "../database/schemas/booking.schema";
import { Types } from "mongoose";
import { PaymentStatus } from "../../domain/models/payment";

@injectable()
export class BookingRepository extends BaseRepository<IBooking> implements IBookingRepository {
    constructor(){
        super(Booking)
    }

    async findByIdAndUpdatePaymentStatus(bookingId: Types.ObjectId, status: PaymentStatus): Promise<void> {
        await this.update(bookingId,{paymentStatus : status})
    }
}