import { injectable } from "tsyringe";
import { IServiceRepository } from "../../../entities/repositoryInterfaces/service/service-repository.interface";
import { IServiceEntity } from "../../../entities/models/service.entity";
import { serviceModel } from "../../../frameworks/database/models/service.model";
import { IServiceFilter } from "../../../shared/types/vendor/service.type";
import { PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { ObjectId } from "mongoose";

@injectable()
export class ServiceRepository implements IServiceRepository {
  async create(serviceData: Partial<IServiceEntity>): Promise<IServiceEntity> {
    return await serviceModel.create(serviceData);
  }

  async findById(id: string): Promise<IServiceEntity | null> {
    return await serviceModel.findById(id);
  }

  async serviceExists(name: string , vendorId : string): Promise<IServiceEntity | null> {
    return await serviceModel.findOne({
      serviceTitle: { $regex: new RegExp(`^${name.trim()}$`, "i") },
      vendor : vendorId
    });
  }

  async findAllServiceByVendor(
    filter: IServiceFilter,
    skip: number,
    limit: number,
    sort?: any
  ): Promise<PaginatedResponse<IServiceEntity>> {
    const [services, total] = await Promise.all([
      serviceModel
        .find(filter)
        .populate({
          path: "category",
        })
        .sort(sort)
        .skip(skip)
        .limit(limit),
      serviceModel.countDocuments(filter),
    ]);

    return {
      data: services,
      total: total,
    };
  }

  async update(
    id: string | ObjectId,
    updateData: Partial<IServiceEntity>
  ): Promise<IServiceEntity | null> {
    return await serviceModel.findByIdAndUpdate(id, updateData);
  }

  async saveCount(
    serviceId: any,
    dateString: string,
    startTime: string,
    endTime: string
  ): Promise<void> {
    const service = await serviceModel.findById(serviceId);

    if (!service) {
      throw new Error("Service not found");
    }

    const dateIndex = service.availableDates.findIndex(
      (date) => date.date === dateString
    );

    if (dateIndex === -1) {
      throw new Error("Date not found in service availability");
    }

    const timeSlotIndex = service.availableDates[dateIndex].timeSlots.findIndex(
      (slot) => slot.startTime === startTime && slot.endTime === endTime
    );

    if (timeSlotIndex === -1) {
      throw new Error("Time slot not found for the given date");
    }

    // Decrement the capacity  count
    service.availableDates[dateIndex].timeSlots[timeSlotIndex].capacity += -1;

    // Save the updated service
    await service.save();
  }

  async addslot(
    serviceId: string | ObjectId,
    dateString: string,
    startTime: string,
    endTime: string
  ): Promise<void> {
    const service = await serviceModel.findById(serviceId);

    if (!service) {
      throw new Error("Service not found");
    }

    const dateIndex = service.availableDates.findIndex(
      (date) => date.date === dateString
    );

    if (dateIndex === -1) {
      throw new Error("Date not found in service availability");
    }

    const timeSlotIndex = service.availableDates[dateIndex].timeSlots.findIndex(
      (slot) => slot.startTime === startTime && slot.endTime === endTime
    );

    if (timeSlotIndex === -1) {
      throw new Error("Time slot not found for the given date");
    }

    // Decrement the capacity  count
    service.availableDates[dateIndex].timeSlots[timeSlotIndex].capacity += +1;

    // Save the updated service
    await service.save();
  }
}
