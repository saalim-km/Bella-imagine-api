import { model, Document } from "mongoose";
import { PaymentSchema } from "../schemas/payment.schema";

export interface IPaymentEntity extends Document {
    vendorId: string;
    amount: number;
    currency: string;
    status: "pending" | "completed" | "failed";
    transactionId?: string;
    method: "card" | "upi" | "netbanking" | "wallet";
    paymentDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentModel = model<IPaymentEntity>("Payment", PaymentSchema);

export { PaymentModel };
