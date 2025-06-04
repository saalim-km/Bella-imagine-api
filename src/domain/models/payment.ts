import { Types } from "mongoose";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "refunded"
  | "partially_refunded";

export type Purpose = "vendor-booking";
export interface IPaymentEntity {
  _id?: Types.ObjectId
  userId: Types.ObjectId
  receiverId?: Types.ObjectId
  bookingId?: Types.ObjectId
  createrType: "Client" | "Vendor" | "Admin";
  receiverType: "Client" | "Vendor" | "Admin";
  transactionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentIntentId?: string;
  purpose: Purpose;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PopulatedPayments
  extends Omit<IPaymentEntity, "userId" | "recieverId"> {
  userId: {
    _id: Types.ObjectId
    firstName?: string;
    lastName?: string;
    email: string;
  };
  recieverId: {
    _id: Types.ObjectId
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

export interface PopulatedPaymentsResponse {
  payments: PopulatedPayments[];
  total: number;
}
