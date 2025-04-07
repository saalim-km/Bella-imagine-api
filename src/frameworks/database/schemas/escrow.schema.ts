import mongoose from "mongoose";
import { IEscrowModel } from "../models/escrow.model";

export const escrowSchema = new mongoose.Schema<IEscrowModel>({
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    platformFee: {
      type: Number,
      required: true,
    },
    vendorAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['held', 'released', 'refunded'],
      default: 'held',
    },
    releaseDate: {
      type: Date,
    },
    releasedAt: {
      type: Date,
    }
  }, { timestamps: true });