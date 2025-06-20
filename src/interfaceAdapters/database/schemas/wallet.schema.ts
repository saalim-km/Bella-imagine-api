import { model, Schema } from "mongoose";
import { IWallet } from "../../../domain/models/wallet";

export const walletSchema = new Schema<IWallet>(
  {
    userId: { type: Schema.Types.ObjectId, refPath: "userType" },
    userType: {
      type: String,
      required: true,
      enum: ["Client", "Vendor", "Admin"],
    },

    role: { type: String, required: true },
    balance: { type: Number, default: 0 },
    paymentId: [{ type: Schema.Types.ObjectId, ref: "Payment" }],
  },
  { timestamps: true }  
);


export const Wallet = model<IWallet>('Wallet',walletSchema);