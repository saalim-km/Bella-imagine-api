import { BookingListFromRepo } from "../../models/booking.entity";

export interface IGetAllBookingByClientUseCase {
  execute(
    vendorId: any,
    pageNumber: number,
    pageSize: number,
    searchTerm: string,
    sortBy: string
  ): Promise<BookingListFromRepo>;
}
