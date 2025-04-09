import { BookingListFromRepo } from "../../models/booking.entity";

export interface IGetAllBookingForVendorUseCase {
  execute(
    vendorId: any,
    pageNumber: number,
    pageSize: number,
    searchTerm: string,
    sortBy: string
  ): Promise<BookingListFromRepo>;
}