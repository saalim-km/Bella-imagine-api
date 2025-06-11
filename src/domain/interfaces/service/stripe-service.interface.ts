import { PaymentStatus } from "../../models/payment";
import { CreatePaymentIntenServicetInput } from "../usecase/types/client.types";
import {Stripe} from 'stripe'

export interface IStripeService {
    createPaymentIntent(input : CreatePaymentIntenServicetInput): Promise<Stripe.PaymentIntent>
    updatePaymentStatus(paymentIntentId: string,status: PaymentStatus) : Promise<void>
    handleWebhookEvent(event : Stripe.Event) : Promise<void>
}