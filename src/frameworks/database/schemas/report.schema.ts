import { Schema } from "mongoose";

const ReportSchema = new Schema(
    {
        reporterId: { type: Schema.Types.ObjectId, ref: "Client", required: true }, // Who is reporting
        reportedId: { type: Schema.Types.ObjectId, ref: "Client", required: true }, // Who is being reported
        reason: { type: String, required: true, trim: true }, // Reason for the report
        details: { type: String, trim: true }, // Additional details (optional)
        status: { type: String, enum: ["pending", "resolved", "rejected"], default: "pending" }, // Admin review status
        adminResponse: { type: String, trim: true }, // Admin's action or response (optional)
    },
    { timestamps: true }
);

export { ReportSchema };
