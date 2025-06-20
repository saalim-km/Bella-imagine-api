import { Types } from "mongoose";
import { TRole } from "../../shared/constants/constants";
import { PaymentStatus, Purpose } from "./payment";

export interface IWallet {
  _id:  Types.ObjectId;
  userId: Types.ObjectId;
  userType: "Client" | "Vendor" | "Admin";
  paymentId: Types.ObjectId[];
  role: TRole
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PopulatedWallet
  extends Omit<IWallet, "userId" | "paymentId"> {
  userId: {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
  };
  paymentId: {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    bookingId: Types.ObjectId;
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