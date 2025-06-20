import { Types } from "mongoose";
import { IUserBase } from "./user-base";

export interface IVendor extends IUserBase {
  vendorId: string;
  languages: string[];
  services: Types.ObjectId[];
  workSamples: Types.ObjectId[];
  description: string;
  portfolioWebsite: string;
  categories: Types.ObjectId[];
  verificationDocument: string;
  isVerified: "pending" | "accept" | "reject";
  minCharge ?: number;
  maxCharge ?: number;
  tags ?: string[]
}
