import Stripe from "stripe";
import { inject, injectable } from "tsyringe";
import { IPaymentRepository } from "../../entities/repositoryInterfaces/payment/payment-repository.interface";
import { PaymentStatus } from "../../entities/models/payment.entity";
import { config } from "../../shared/config";
import { CustomError } from "../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IPaymentService } from "../../entities/services/stripe-service.interface";

@injectable()
export class StripeService implements IPaymentService {
  private stripe: Stripe;
  private apiKey: string;

  constructor(
    @inject("IPaymentRepository") private paymentRepository: IPaymentRepository,
    @inject("IBookingRepository") private bookingRepository: IBookingRepository
  ) {
    this.apiKey = config.stripe.STRIPE_SECRET_KEY;
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: "2025-03-31.basil",
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string
  ): Promise<{
    paymentIntent: string;
    clientSecret: string;
  }> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        paymentIntent: paymentIntent.id!,
        clientSecret: paymentIntent.client_secret!,
      };
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw new CustomError(
        "Failed to create payment intent",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async confirmPayment(paymentIntentId: string): Promise<boolean> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        paymentIntentId
      );
      return paymentIntent.status === "succeeded";
    } catch (error) {
      console.error("Error confirming payment:", error);
      throw new CustomError(
        ERROR_MESSAGES.CONFIRM_PAYMENT_FAILED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async refundPayment(
    paymentIntentId: string,
    amount?: number
  ): Promise<boolean> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      if (!paymentIntent.latest_charge) {
        throw new CustomError(
          ERROR_MESSAGES.NO_CHARGE_FOUND,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const chargeId =
        typeof paymentIntent.latest_charge === "string"
          ? paymentIntent.latest_charge
          : paymentIntent.latest_charge.id;

      const refundParams: Stripe.RefundCreateParams = {
        charge: chargeId,
        ...(amount && { amount }),
      };

      const refund = await this.stripe.refunds.create(refundParams);

      const refundStatus: PaymentStatus =
        amount && amount < paymentIntent.amount
          ? "partially_refunded"
          : "refunded";

      await this.updatePaymentStatus(paymentIntentId, refundStatus);

      return refund.status === "succeeded";
    } catch (error) {
      console.error("Error processing refund:", error);
      throw new CustomError(
        ERROR_MESSAGES.FAILED_TO_PROCESS_REFUND,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updatePaymentStatus(
    paymentIntentId: string,
    status: PaymentStatus
  ): Promise<void> {
    const payment =
      await this.paymentRepository.findByPaymentIntentIdAndUpdateStatus(
        paymentIntentId,
        status
      );

    if (payment) {
      this.bookingRepository.findByIdAndUpdatePaymentStatus(
        payment.bookingId,
        status
      );

      if (status === "refunded") {
        this.bookingRepository.findByIdAndUpdateBookingStatus(
          payment.bookingId,
          "cancelled"
        );
      }
    }
  }

  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case "payment_intent.succeeded":
        const successfulPayment = event.data.object as Stripe.PaymentIntent;
        console.log("webhook trigger=>", successfulPayment);
        await this.updatePaymentStatus(successfulPayment.id!, "succeeded");
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await this.updatePaymentStatus(failedPayment.id, "failed");
        break;
      case "payment_intent.created":
        const createdPayment = event.data.object as Stripe.PaymentIntent;
        await this.updatePaymentStatus(createdPayment.id, "pending");
        break;

      case "payment_intent.processing":
        const processingPayment = event.data.object as Stripe.PaymentIntent;
        await this.updatePaymentStatus(processingPayment.id, "processing");
        break;

      case "payment_intent.canceled":
        const canceledPayment = event.data.object as Stripe.PaymentIntent;
        await this.updatePaymentStatus(canceledPayment.id, "failed");
        break;

      case "charge.refunded":
        const refundedCharge = event.data.object as Stripe.Charge;
        if (refundedCharge.amount_refunded < refundedCharge.amount) {
          await this.updatePaymentStatus(
            refundedCharge.payment_intent as string,
            "partially_refunded"
          );
        } else {
          await this.updatePaymentStatus(
            refundedCharge.payment_intent as string,
            "refunded"
          );
        }
        break;
    }
  }
}
