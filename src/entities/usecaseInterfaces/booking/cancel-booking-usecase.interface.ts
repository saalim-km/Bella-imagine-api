export interface ICancelBookingUseCase {
  execute(bookingId: any): Promise<void>;
}
