import { IAdminRepository } from "../../../entities/repositoryInterfaces/admin/admin-repository.interface";
import { ClientModel } from "../../../frameworks/database/models/client.model";
import { VendorModel } from "../../../frameworks/database/models/vendor.model";
import { IVendorEntity } from "../../../entities/models/vendor.entity";
import { IClientEntity } from "../../../entities/models/client.entity";
import { CategoryModel } from "../../../frameworks/database/models/category.model";
import { PaymentModel } from "../../../frameworks/database/models/payment.model";
import { ReportModel } from "../../../frameworks/database/models/report.mode";
import { IUserEntity } from "../../../entities/models/user.entity";

export class AdminRepository implements IAdminRepository {
    
    async findById(id: string): Promise<IUserEntity | null> {
        return await ClientModel.findById(id);
    }

    async findByEmail(email: string): Promise<IUserEntity | null> {
        return await ClientModel.findOne({ email });
    }

    async findByIDAndUpdate(id: string, data: Partial<IUserEntity>): Promise<IUserEntity | null> {
        return await ClientModel.findByIdAndUpdate(id, data, { new: true });
    }

    // Category Management
    async saveCategory(category: string): Promise<void> {
        await CategoryModel.create({ name: category });
    }

    async getCategories(): Promise<string[]> {
        const categories = await CategoryModel.find({});
        return categories.map(category => category.name);
    }

    async deleteCategory(categoryId: string): Promise<void> {
        await CategoryModel.findByIdAndDelete(categoryId);
    }

    // User (Client & Vendor) Management
    async getAllClients(): Promise<IClientEntity[]> {
        return await ClientModel.find({});
    }

    async getAllVendors(): Promise<IVendorEntity[]> {
        return await VendorModel.find({});
    }

    async blockUser(userId: string): Promise<void> {
        await ClientModel.findByIdAndUpdate(userId, { isBlocked: true });
    }

    async unblockUser(userId: string): Promise<void> {
        await ClientModel.findByIdAndUpdate(userId, { isBlocked: false });
    }


    // Payment Management
    async getAllPayments(): Promise<any[]> {
        return await PaymentModel.find({});
    }

    async getPaymentByVendor(vendorId: string): Promise<any> {
        return await PaymentModel.findOne({ vendorId });
    }

    async updatePaymentStatus(paymentId: string, status: string): Promise<void> {
        await PaymentModel.findByIdAndUpdate(paymentId, { status });
    }

    // Report Management
    async getAllReports(): Promise<any[]> {
        return await ReportModel.find({});
    }

    async resolveReport(reportId: string): Promise<void> {
        await ReportModel.findByIdAndUpdate(reportId, { status: "resolved" });
    }


    async getDashboardStats(): Promise<{ clients: number; vendors: number; revenue: number }> {
        const clients = await ClientModel.countDocuments();
        const vendors = await VendorModel.countDocuments();
        const revenue = await PaymentModel.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);

        return {
            clients,
            vendors,
            revenue: revenue.length ? revenue[0].total : 0,
        };
    }
}
