import Stripe from "stripe";

export interface IPaymentService {
  createPaymentIntent(
    amount: number,
    currency: string
  ): Promise<{
    paymentIntent: string;
    clientSecret: string;
  }>;
  confirmPayment(paymentIntentId: string): Promise<boolean>;
  refundPayment(paymentIntentId: string, amount?: number): Promise<boolean>;
  updatePaymentStatus(paymentIntentId: string, status: string): Promise<void>;
  handleWebhookEvent(event: Stripe.Event): Promise<void>;
}