export interface IUpdateBookingStatusUseCase {
  execute(userId: any, bookingId: any, status: string): Promise<void>;
}
