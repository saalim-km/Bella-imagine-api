import { PaymentStatus } from "../../models/payment";
import {Stripe} from 'stripe'
import { CreatePaymentIntenServicetInput } from "../usecase/types/payment.types";

export interface IStripeService {
    createPaymentIntent(input : CreatePaymentIntenServicetInput): Promise<Stripe.PaymentIntent>
    updatePaymentStatus(paymentIntentId: string,status: PaymentStatus) : Promise<void>
    handleWebhookEvent(event : Stripe.Event) : Promise<void>
}