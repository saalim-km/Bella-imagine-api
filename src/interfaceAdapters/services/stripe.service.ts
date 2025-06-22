import { inject, injectable } from "tsyringe";
import { IStripeService } from "../../domain/interfaces/service/stripe-service.interface";
import Stripe from "stripe";
import { config } from "../../shared/config/config";
import { PaymentStatus } from "../../domain/models/payment";
import { TPaymentStatus } from "../../shared/types/booking.types";
import { IBookingRepository } from "../../domain/interfaces/repository/booking.repository";
import { IPaymentRepository } from "../../domain/interfaces/repository/payment.repository";
import { CreatePaymentIntenServicetInput } from "../../domain/interfaces/usecase/types/payment.types";

@injectable()
export class StripeService implements IStripeService {
    private _stripe : Stripe
    private _apiKey : string;
    constructor(
        @inject('IBookingRepository') private _bookingRepository : IBookingRepository,
        @inject('IPaymentRepository') private _paymentRepository : IPaymentRepository
    ){
        this._apiKey = config.stripe.STRIPE_SECRET_KEY,
        this._stripe = new Stripe(this._apiKey , {
            apiVersion : '2025-03-31.basil'
        })
    }

    async createPaymentIntent(input: CreatePaymentIntenServicetInput): Promise<Stripe.PaymentIntent> {
        const {amount , currency ,description,receiptEmail , metadata } = input;
        const paymentIntent =  await this._stripe.paymentIntents.create({
            amount : amount,
            currency : currency,
            automatic_payment_methods : {
                enabled : true
            },
            description : description,
            receipt_email : receiptEmail,
            metadata : metadata
        })

        return paymentIntent
    }

    async updatePaymentStatus(
    paymentIntentId: string,
    status: PaymentStatus
  ): Promise<void> {
    const payment =
      await this._paymentRepository.findByIntentIdAndUpdateStatus(
        paymentIntentId,
        status
      );

    if (payment) {
      this._bookingRepository.findByIdAndUpdatePaymentStatus(
        payment.bookingId!,
        status
      );    
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