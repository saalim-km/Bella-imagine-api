import { Booking, IBookingEntity } from "../../models/booking.entity";

export interface ICreateNewBookingUseCase {
  execute(
    userId: any,
    vendorId: any,
    data: Booking
  ): Promise<IBookingEntity | null>;
}
