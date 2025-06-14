import { Types } from "mongoose";

export interface creditAmountToWalletInput {
    userId: Types.ObjectId
    amount: number;
    purpose : string;
    bookingId : Types.ObjectId;
}