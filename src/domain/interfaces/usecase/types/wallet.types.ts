import { Types } from "mongoose";
import { Purpose } from "../../../models/payment";

export interface creditAmountToWalletInput {
    userId: Types.ObjectId
    amount: number;
    purpose : Purpose;
    bookingId : Types.ObjectId;
}