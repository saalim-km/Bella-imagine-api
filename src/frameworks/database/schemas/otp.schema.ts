import { Schema } from "mongoose";
import { IOTPModel } from "../models/otp.model";

export const OTPSchema = new Schema<IOTPModel>(
  {
    otp: { type: String, required: true },
    email: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 60 } },
  },
  { timestamps: true }
);