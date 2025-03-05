import { model, ObjectId } from "mongoose";
import { OTPSchema } from "../schemas/otp.schema";

export interface IOTPModel extends Document {
  _id: ObjectId;
  otp: string;
  email: string;
  expiresAt: Date;
}

export const OTPModel = model<IOTPModel>("OTP", OTPSchema);
