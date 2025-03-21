import { injectable } from "tsyringe";
import { IVendorRepository } from "../../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IVendorEntity } from "../../../entities/models/vendor.entity";
import { VendorModel } from "../../../frameworks/database/models/vendor.model";
import { ObjectId } from "mongoose";
import { PaginatedResponse } from "../../../shared/types/admin/admin.type";

@injectable()
export class VendorRepository implements IVendorRepository {
    async find(filter: Record<string, any>, skip: number, limit: number , sort : any): Promise<PaginatedResponse<IVendorEntity>> {

        const [user, total] = await  Promise.all([
            VendorModel.find(filter).sort({createdAt : sort}).skip(skip).limit(limit),
            VendorModel.countDocuments(filter),
        ]);
        
        return {
            data : user,
            total
        }
    }

    async save(vendor: IVendorEntity): Promise<IVendorEntity> {
        return await VendorModel.create(vendor);
    }

    async findByEmail(email: string): Promise<IVendorEntity | null> {
        return await VendorModel.findOne({ email });
    }

    async findById(id: string | ObjectId): Promise<IVendorEntity | null> {
        return await VendorModel.findById(id);
    }

    async findByIdAndUpdateVendorCategories(id: string | ObjectId, categories: ObjectId[]): Promise<IVendorEntity | null> {
        return await VendorModel.findByIdAndUpdate(id, { categories : categories }, { new: true });
    }

    async findByIdAndResetCategory(id: string | ObjectId): Promise<void> {
        await VendorModel.findByIdAndUpdate(id, { categories: [] });
    }

    async updateVendorStatus(id: string | ObjectId, isActive: boolean): Promise<void> {
        await VendorModel.findByIdAndUpdate(id, { isActive });
    }

    async updateVendorPassword(id: string | ObjectId, password: string): Promise<void> {
        await VendorModel.findByIdAndUpdate(id, { password });
    }

    async updateVendorProfile(id: string | ObjectId, data: Partial<IVendorEntity>): Promise<IVendorEntity | null> {
        return await VendorModel.findByIdAndUpdate(id, data, { new: true });
    }

    async addAvailableSlot(id: string | ObjectId, slot: { slotDate: string; slotBooked: boolean }): Promise<void> {
        await VendorModel.findByIdAndUpdate(id, { $push: { availableSlots: slot } });
    }

    async removeAvailableSlot(id: string | ObjectId, slotDate: string): Promise<void> {
        await VendorModel.findByIdAndUpdate(id, { $pull: { availableSlots: { slotDate } } });
    }

    async updateSlotBookingStatus(id: string | ObjectId, slotDate: string, isBooked: boolean): Promise<void> {
        await VendorModel.findOneAndUpdate(
            { _id: id, "availableSlots.slotDate": slotDate },
            { $set: { "availableSlots.$.slotBooked": isBooked } }
        );
    }

    async addNotification(id: string | ObjectId, notification: string): Promise<void> {
        await VendorModel.findByIdAndUpdate(id, { $push: { notifications: notification } });
    }

    async clearNotifications(id: string | ObjectId): Promise<void> {
        await VendorModel.findByIdAndUpdate(id, { notifications: [] });
    }

    async addService(id: string | ObjectId, service: { category: string | ObjectId; duration: number; pricePerHour: number }): Promise<void> {
        await VendorModel.findByIdAndUpdate(id, { $push: { services: service } });
    }

    async removeService(id: string | ObjectId, categoryId: string | ObjectId): Promise<void> {
        await VendorModel.findByIdAndUpdate(id, { $pull: { services: { category: categoryId } } });
    }

    
    async updateServiceDetails(
        id: string | ObjectId,
        categoryId: string | ObjectId,
        update: { duration?: number; pricePerHour?: number }
    ): Promise<void> {
        await VendorModel.findOneAndUpdate(
            { _id: id, "services.category": categoryId },
            { $set: { "services.$": { ...update } } }
        );
    }
}
