import { inject, injectable } from "tsyringe";
import { IPaymentService } from "../../entities/services/stripe-service.interface";
import { IConfirmPaymentUseCase } from "../../entities/usecaseInterfaces/payment/confirm-payment.usecase";
import { IPaymentRepository } from "../../entities/repositoryInterfaces/payment/payment-repository.interface";
import { CustomError } from "../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../shared/constants";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";

@injectable()
export class ConfirmPaymentUseCase implements IConfirmPaymentUseCase {
  constructor(
    @inject("IPaymentService") private paymentService: IPaymentService,
    @inject("IPaymentRepository") private paymentRepository: IPaymentRepository,
    @inject("IBookingRepository") private bookingRepository: IBookingRepository
  ) {}

  async execute(paymentIntentId: string): Promise<boolean> {
    const isConfirmed = await this.paymentService.confirmPayment(
      paymentIntentId
    );
    const payment = (
      await this.paymentRepository.findByPaymentIntentId(paymentIntentId)
    )
    if (!isConfirmed) {
      throw new CustomError(
        "Failed to confirm payment",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

      await this.paymentRepository.findByPaymentIntentIdAndUpdateStatus(
        paymentIntentId,
        "succeeded"
      )

      await this.bookingRepository.findByPaymentIdAndUpdateBookingStatus(
        payment?._id,
        "completed"
      )

    return isConfirmed;
  }
}
