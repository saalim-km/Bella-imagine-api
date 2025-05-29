import { ObjectId } from "mongoose";
import { TRole } from "../../shared/constants/constants";
import { PaymentStatus, Purpose } from "./payment";

export interface IWallet {
  _id:  ObjectId;
  userId: ObjectId;
  userType: "Client" | "Vendor" | "Admin";
  paymentId: ObjectId[];
  role: TRole
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PopulatedWallet
  extends Omit<IWallet, "userId" | "paymentId"> {
  userId: {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    email: string;
  };
  paymentId: {
    _id: ObjectId;
    userId: ObjectId;
    bookingId: ObjectId;
    transactionId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paymentIntentId?: string;
    purpose: Purpose;
    createdAt?: Date;
    updatedAt?: Date;
  }[];
}