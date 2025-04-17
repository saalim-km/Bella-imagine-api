import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IPaymentRepository } from "../../entities/repositoryInterfaces/payment/payment-repository.interface";
import { IPaymentService } from "../../entities/services/stripe-service.interface";
import { ICancelBookingUseCase } from "../../entities/usecaseInterfaces/booking/cancel-booking-usecase.interface";
import { CustomError } from "../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../shared/constants";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet-repository.interface";

@injectable()
export class CancelBookingUseCase implements ICancelBookingUseCase {
  constructor(
    @inject("IBookingRepository") private bookingRepository: IBookingRepository,
    @inject("IPaymentRepository") private paymentRepository: IPaymentRepository,
    @inject("IPaymentService") private paymentService: IPaymentService,
    @inject("IWalletRepository") private walletRepository: IWalletRepository
  ) {}
  async execute(bookingId: string): Promise<void> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw new CustomError("Booking not found", HTTP_STATUS.NOT_FOUND);
    }

    const payment = await this.paymentRepository.findByBookingId(bookingId);

    if (payment && payment.paymentIntentId && payment.status === "succeeded") {
      await this.paymentService.refundPayment(payment.paymentIntentId);
    }

    await this.bookingRepository.findByIdAndUpdateBookingStatus(
      bookingId,
      "cancelled"
    );
    await Promise.all([
      await this.walletRepository.findWalletByUserIdAndUpdateBalanceAndAddPaymentId(
        booking.userId,
        booking.totalPrice,
        payment?._id
      ),
    ]);
  }
}
