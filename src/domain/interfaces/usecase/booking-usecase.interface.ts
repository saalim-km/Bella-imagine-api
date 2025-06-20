import { Types } from "mongoose";
import { IBooking } from "../../models/booking";
import { CreatePaymentIntentInput, GetAllBookingsInput, updateBookingStatusInput } from "./types/client.types";
import { PaginatedResponse } from "./types/common.types";


export interface IBookingCommandUsecase {
    createPaymentIntentAndBooking(input : CreatePaymentIntentInput) : Promise<string>
    updateBookingStatus(input : updateBookingStatusInput): Promise<void>
    cancelBooking(bookingId: Types.ObjectId , userId : Types.ObjectId): Promise<void>
}

export interface IBookingQueryUsecase {
    fetchAllBookings(input : GetAllBookingsInput) : Promise<PaginatedResponse<IBooking>>
}