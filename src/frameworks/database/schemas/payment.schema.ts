import { Schema } from "mongoose";

const PaymentSchema = new Schema(
    {
        vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
        amount: { type: Number, required: true, min: 0 },
        currency: { type: String, required: true, default: "INR" },
        status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
        transactionId: { type: String, unique: true },
        method: { type: String, enum: ["card", "upi", "netbanking", "wallet"], required: true },
        paymentDate: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export { PaymentSchema };
