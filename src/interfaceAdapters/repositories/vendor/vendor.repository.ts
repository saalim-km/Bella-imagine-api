import { injectable } from "tsyringe";
import { IVendorRepository } from "../../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IVendorEntity } from "../../../entities/models/vendor.entity";
import {
  IVendorModel,
  VendorModel,
} from "../../../frameworks/database/models/vendor.model";
import { ObjectId, Types } from "mongoose";
import { PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { IServiceEntity } from "../../../entities/models/service.entity";
import { IWorkSampleEntity } from "../../../entities/models/work-sample.entity";

@injectable()
export class VendorRepository implements IVendorRepository {
  async find(
    filter: Record<string, any>,
    skip: number,
    limit: number,
    sort: any
  ): Promise<PaginatedResponse<IVendorEntity>> {
    const [user, total] = await Promise.all([
      VendorModel.find(filter)
        .populate([
          {
            path: "services",
            populate: {
              path: "category",
            },
          },
          { path: "workSamples" },
          { path: "categories" },
        ])
        .sort({ createdAt: sort })
        .skip(skip)
        .limit(limit)
        .lean(),
      VendorModel.countDocuments(filter),
    ]);

    return {
      data: user,
      total,
    };
  }

  async save(vendor: IVendorEntity): Promise<IVendorEntity> {
    return await VendorModel.create(vendor);
  }

  async findByEmail(email: string): Promise<IVendorEntity | null> {
    return await VendorModel.findOne({ email });
  }

  async findById(id: string | ObjectId): Promise<IVendorEntity | null> {
    const result =  await VendorModel.findById(id)
    .populate('categories')
    .select('-password')
    .lean<Omit<IVendorEntity,"password">>()
    .exec()

    return result
  }

  async findPaginatedServices(
    vendorId: string,
    page: number,
    limit: number
  ): Promise<{ data: IServiceEntity[]; total: number }> {
    const pipeline = [
      { $match: { _id: new Types.ObjectId(vendorId) } },
      {
        $lookup: {
          from: "services",
          localField: "services",
          foreignField: "_id",
          as: "services",
        },
      },
      {
        $addFields: {
          totalServices: { $size: "$services" },
          services: { $slice: ["$services", (page - 1) * limit, limit] },
        },
      },
      {
        $project: {
          services: 1,
          totalServices: 1,
        },
      },
    ];

    const aggregatedData = await VendorModel.aggregate(pipeline).exec();
    const result: {
      _id: string;
      services: IServiceEntity[];
      totalServices: number;
    } = aggregatedData[0];
    console.log("service result from aggregate", result);
    return {
      data: result.services,
      total: result.totalServices,
    };
  }

  async findPaginatedWorkSamples(
    vendorId: string,
    page: number,
    limit: number
  ): Promise<{ data: IWorkSampleEntity[]; total: number }> {
    const pipeline = [
      { $match: { _id: new Types.ObjectId(vendorId) } },
      {
        $lookup: {
          from: "worksamples",
          localField: "workSamples",
          foreignField: "_id",
          as: "samples",
        },
      },
      {
        $addFields: {
          totalSamples: { $size: "$samples" },
          samples: { $slice: ["$samples", (page - 1) * limit, limit] },
        },
      },
      {
        $project: {
          samples: 1,
          totalSamples: 1,
        },
      },
    ];

    const aggregatedData = await VendorModel.aggregate(pipeline).exec();
    const result: {
      _id: string;
      samples: IWorkSampleEntity[];
      totalSamples: number;
    } = aggregatedData[0];
    console.log("worksample result from aggregate", result);
    return {
      data: result.samples,
      total: result.totalSamples,
    };
  }

  async findByIdAndUpdateVendorCategories(
    id: string | ObjectId,
    categories: ObjectId[]
  ): Promise<IVendorEntity | null> {
    return await VendorModel.findByIdAndUpdate(
      id,
      { categories: categories },
      { new: true }
    );
  }

  async updateVendorStatus(
    id: string | ObjectId,
    isActive: boolean
  ): Promise<void> {
    await VendorModel.findByIdAndUpdate(id, { isActive });
  }

  async updateVendorPassword(
    id: string | ObjectId,
    password: string
  ): Promise<void> {
    await VendorModel.findByIdAndUpdate(id, { password });
  }

  async updateVendorProfile(
    id: string | ObjectId,
    data: Partial<IVendorEntity>
  ): Promise<IVendorEntity | null> {
    return await VendorModel.findByIdAndUpdate(id, data, { new: true });
  }

  async updateSlotBookingStatus(
    id: string | ObjectId,
    slotDate: string,
    isBooked: boolean
  ): Promise<void> {
    await VendorModel.findOneAndUpdate(
      { _id: id, "availableSlots.slotDate": slotDate },
      { $set: { "availableSlots.$.slotBooked": isBooked } }
    );
  }

  async clearNotifications(id: string | ObjectId): Promise<void> {
    await VendorModel.findByIdAndUpdate(id, { notifications: [] });
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

  async updateOnlineStatus(
    id: string,
    isOnline: boolean,
    lastSeen?: Date
  ): Promise<any> {
    return await VendorModel.findByIdAndUpdate(
      id,
      { isOnline, lastSeen },
      { new: true }
    );
  }

  // -------------------------------------------------------------------------
  async findByIdForChat(id: any): Promise<IVendorEntity | null> {
    return VendorModel.findById(id).exec();
  }

  async findByIdAndUpdateOnlineStatus(
    vendorId: string,
    status: true | false
  ): Promise<IVendorModel | null> {
    return (await VendorModel.findByIdAndUpdate(
      vendorId,
      { isOnline: status, lastStatusUpdated: new Date() },
      { new: true }
    )
      .lean()
      .exec()) as IVendorModel | null;
  }

  async updateLastSeen(vendorId: string, lastSeen: string): Promise<void> {
    await VendorModel.findByIdAndUpdate(vendorId, {
      $set: { lastSeen: lastSeen },
    });
  }
}
