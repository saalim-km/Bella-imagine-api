import { inject, injectable } from "tsyringe";
import { GetAllBookingsInput } from "../../domain/interfaces/usecase/types/client.types";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";
import { IBooking } from "../../domain/models/booking";
import { IBookingRepository } from "../../domain/interfaces/repository/booking.repository";
import { IBookingQueryUsecase } from "../../domain/interfaces/usecase/booking-usecase.interface";

@injectable()
export class BookingQueryUsecase implements IBookingQueryUsecase {
  constructor(
    @inject('IBookingRepository') private _bookingRepository : IBookingRepository,
  ) {}

  async fetchAllBookings(
    input: GetAllBookingsInput
  ): Promise<PaginatedResponse<IBooking>> {

    const queryInput = {
      userId: input.role === "client" ? input.userId : undefined,
      vendorId: input.role === "vendor" ? input.userId : undefined,
      ...input.query,
    };

    return await this._bookingRepository.findBookings(queryInput)
  }
}
