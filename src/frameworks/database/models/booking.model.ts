import { model , Document } from "mongoose";
import { IBookingEntity } from "../../../entities/models/booking.entity";
import { bookingSchema } from "../schemas/booking.schema";

export interface IBookingModel extends IBookingEntity {}

export const bookingModel = model('Booking',bookingSchema)