import { model, Document } from "mongoose";
import { ReportSchema } from "../schemas/report.schema";

export interface IReportEntity extends Document {
    reporterId: string;
    reportedId: string;
    reason: string;
    details?: string;
    status: "pending" | "resolved" | "rejected";
    adminResponse?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ReportModel = model<IReportEntity>("Report", ReportSchema);

export { ReportModel };
