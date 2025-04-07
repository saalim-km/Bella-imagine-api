import { Purpose } from "../../models/payment.entity";

export interface ICreatePaymentIntentUseCase {
  execute(
    amount: number,
    currency: string,
    purpose: Purpose,
    userId: string,
    recieverId: any,
    createrType: string,
    receiverType: string,
    bookingId?: string
  ): Promise<{
    paymentIntent: string;
    clientSecret: string;
  }>;
}