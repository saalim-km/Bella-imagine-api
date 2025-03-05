import { ObjectId } from "mongoose";
import { IVendorEntity } from "../../models/vendor.entity";

export interface IVendorRepository {
    //Core methods
    save(user : IVendorEntity) : Promise<IVendorEntity>;

    findByEmail(email : string) : Promise<IVendorEntity | null>;
    findById(id : string | ObjectId) : Promise<IVendorEntity | null>;
    
    // Managing categories
    findByIdAndUpdateVendorCategories(id: string | ObjectId, categories: string[] | ObjectId[]): Promise<IVendorEntity | null>;
    findByIdAndResetCategory(id : string | ObjectId , category : string | ObjectId): Promise<void>;


    //vendor profile and status
    updateVendorStatus(id: string | ObjectId, isActive: boolean): Promise<void>;
    updateVendorPassword(id : string | ObjectId , password : string) : Promise<void>;
    updateVendorProfile(id: string | ObjectId, data: Partial<IVendorEntity>): Promise<IVendorEntity | null>;

    // Managing Available Slots
    addAvailableSlot(id: string | ObjectId, slot: { slotDate: string; slotBooked: boolean }): Promise<void>;
    removeAvailableSlot(id: string | ObjectId, slotDate: string): Promise<void>;
    updateSlotBookingStatus(id: string | ObjectId, slotDate: string, isBooked: boolean): Promise<void>;

    // Managing Notifications
    addNotification(id: string | ObjectId, notification: string): Promise<void>;
    clearNotifications(id: string | ObjectId): Promise<void>;

    // Managing Services
    addService(
        id: string | ObjectId,
        service: { category: string | ObjectId; duration: number; pricePerHour: number }
    ): Promise<void>;
    removeService(id: string | ObjectId, categoryId: string | ObjectId): Promise<void>;
    updateServiceDetails(
        id: string | ObjectId,
        categoryId: string | ObjectId,
        update: { duration?: number; pricePerHour?: number }
    ): Promise<void>;
}