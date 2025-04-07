import mongoose, { ObjectId } from "mongoose";

export interface IEscrowEntity {
  _id?: ObjectId | string;
  booking: mongoose.Types.ObjectId;
  payment: mongoose.Types.ObjectId;
  client: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  amount: number;
  platformFee: number;
  vendorAmount: number;
  status: "held" | "released" | "refunded" | "disputed";
  releaseDate?: Date;
  releasedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
