import { ObjectId } from "mongoose";
import { IUserBase } from "./user-base";

export interface IVendor extends IUserBase {
  vendorId: string;
  languages: string[];
  services: ObjectId[];
  workSamples: ObjectId[];
  description: string;
  portfolioWebsite: string;
  categories: ObjectId[];
  verificationDocument: string;
  isVerified: "pending" | "accept" | "reject";
}
