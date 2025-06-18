import { injectable } from "tsyringe";
import { BaseUserRepository } from "./base-user-repository.mongo";
import { IVendor } from "../../domain/models/vendor";
import { Vendor } from "../database/schemas/vendor.schema";
import { IVendorRepository } from "../../domain/interfaces/repository/vendor.repository";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";
import { GetQueryInput } from "../../domain/types/admin.type";
import { FilterQuery, Types } from "mongoose";
import { ClientVendorQuery } from "../../domain/types/client.types";
import { IService } from "../../domain/models/service";
import { PaginatedResult } from "../../shared/types/pagination.types";
import { IWorkSample } from "../../domain/models/worksample";
import { GetVendorsOutput } from "../../domain/interfaces/usecase/types/client.types";

@injectable()
export class VendorRepository
  extends BaseUserRepository<IVendor>
  implements IVendorRepository
{
  constructor() {
    super(Vendor);
  }

  async findVendorDetailsById(vendorId: Types.ObjectId): Promise<IVendor | null> {
    return await Vendor.findById(vendorId)
    .populate(
      {
        path : 'categories',
        select : 'title'
      }
    )
    .lean()
  }

  async findAllVendors(
    input: GetQueryInput
  ): Promise<PaginatedResponse<IVendor>> {
    const { filter, limit, skip, sort } = input;
    let query: FilterQuery<IVendor> = {};
    if (filter.isblocked) {
      query.isblocked = filter.isblocked;
    }
    query = {
      ...query,
      $or: [
        { name: { $regex: filter.name || "", $options: "i" } },
        { email: { $regex: filter.email || "", $options: "i" } },
      ],
    };

    const [vendors, count] = await Promise.all([
      this.findAll(query, skip, limit, sort),
      this.count(query),
    ]);
    return {
      data: vendors,
      total: count,
    };
  }

  async fetchVendorListingsForClients(
    input: ClientVendorQuery
  ): Promise<PaginatedResponse<GetVendorsOutput>> {
    const { filter, limit, skip } = input;

    const query: FilterQuery<IVendor> = {};
    if (filter.categories) {
      query.categories = { $in: [filter.categories] };
    }

    if (filter.languages && filter.languages !== "Any Language") {
      query.languages = { $in: [filter.languages.trim()] };
    }

    const [vendors, count] = await Promise.all([
      Vendor.find(query)
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
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.count(query),
    ]);

    return {
      data: vendors as unknown as GetVendorsOutput[],
      total: count,
    };
  }

  async getPaginatedServices(
    vendorId: Types.ObjectId,
    page: number,
    limit: number
  ): Promise<PaginatedResult<IService>> {
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

    const aggregatedData = await Vendor.aggregate(pipeline).exec()
    const result: {
      _id: string;
      services: IService[];
      totalServices: number;
    } = aggregatedData[0];
    console.log("service result from aggregate", result);
    return {
      data: result.services,
      total: result.totalServices,
    };
  }


  async getPaginatedWorkSamples(vendorId: Types.ObjectId, page: number, limit: number): Promise<PaginatedResult<IWorkSample>> {
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

    const aggregatedData = await Vendor.aggregate(pipeline).exec();
    const result: {
      _id: string;
      samples: IWorkSample[];
      totalSamples: number;
    } = aggregatedData[0];
    console.log("worksample result from aggregate", result);
    return {
      data: result.samples,
      total: result.totalSamples,
    };
  }
}
