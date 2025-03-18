import { IClientEntity } from "../../models/client.entity";
import { IUserEntity } from "../../models/user.entity";
import { IVendorEntity } from "../../models/vendor.entity";

export interface IAdminRepository {
    findById(id: string): Promise<IUserEntity | null>;
    findByEmail(email: string): Promise<IUserEntity | null>;
    findByIDAndUpdate(id: string, data: Partial<IUserEntity>): Promise<IUserEntity | null>;
    
    // Category Management
    saveCategory(category: string): Promise<void>;
    getCategories(): Promise<string[]>;
    deleteCategory(categoryId: string): Promise<void>;

    // User Management
    getAllVendors(): Promise<IVendorEntity[]>;
    getAllClients(): Promise<IClientEntity[]>;
    blockUser(userId: string): Promise<void>;
    unblockUser(userId: string): Promise<void>;

    // Payment Management
    getAllPayments(): Promise<any[]>; // Replace `any` with a proper Payment Entity
    getPaymentByVendor(vendorId: string): Promise<any>;
    updatePaymentStatus(paymentId: string, status: string): Promise<void>;

    // Report Management
    getAllReports(): Promise<any[]>; // Replace `any` with a proper Report Entity
    resolveReport(reportId: string): Promise<void>;

    // Dashboard Analytics
    getDashboardStats(): Promise<{ clients: number; vendors: number; revenue: number }>;
}
