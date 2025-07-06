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

  async findVendorDetailsById(
    vendorId: Types.ObjectId
  ): Promise<IVendor | null> {
    return await Vendor.findById(vendorId)
      .populate({
        path: "categories",
        select: "title",
      })
      .lean();
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


    const { limit = 10, skip, sort = { createdAt: -1 }, filter } = input;

    console.log(JSON.stringify(input, null, 2));
    const {
      categories,
      tags,
      services,
      languages,
      minCharge,
      maxCharge,
      geoLocation,
    } = filter;

    // Build the initial match conditions (excluding geoLocation)
    const matchStage: any = {
      isblocked: false,
      role: "vendor",
      isVerified : 'accept'
    };

    // Filter by languages
    if (languages && languages.length > 0) {
      matchStage.languages = { $in: languages };
    }

    // Filter by categories
    if (categories && categories.length > 0) {
      matchStage.categories = { $in: categories };
    }

    // Filter by services
    if (services && services.length > 0) {
      matchStage.services = { $in: services };
    }

    // Build the aggregation pipeline
    const pipeline: any[] = [];

    // Add $geoNear as the first stage if geoLocation is provided
    if (geoLocation && geoLocation.coordinates.length > 0) {
      pipeline.push({
        $geoNear: {
          near: {
            type: geoLocation.type,
            coordinates: geoLocation.coordinates,
          },
          distanceField: "distance", // Store calculated distance in 'distance' field
          minDistance: 0, // 1km minimum
          maxDistance: 20000, // 20km maximum
          spherical: true, // Use spherical geometry for 2dsphere index
          query: matchStage, // Apply initial filters (isblocked, role, etc.)
        },
      });
    } else {
      // If no geoLocation, start with a regular $match
      pipeline.push({ $match: matchStage });
    }

    // Continue building the pipeline
    pipeline.push(
      // Lookup services to get sessionDurations
      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "vendor",
          as: "services",
        },
      },

      // Lookup workSamples
      {
        $lookup: {
          from: "worksamples",
          let: { vendorId: "$_id" },
          pipeline: [
        {
          $match: {
            $expr: {
          $and: [
            { $eq: ["$vendor", "$$vendorId"] },
            { $eq: ["$isPublished", true] },
          ],
            },
          },
        },
          ],
          as: "workSamples",
        },
      },

      // Lookup categories
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories",
        },
      },

      // Unwind services to filter by sessionDurations.price
      { $unwind: { path: "$services", preserveNullAndEmptyArrays: true } },

      // Unwind sessionDurations to apply price filters
      {
        $unwind: {
          path: "$services.sessionDurations",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Filter by minCharge and maxCharge
      {
        $match: {
          ...(minCharge !== undefined &&
          minCharge > 0 &&
          maxCharge !== undefined &&
          maxCharge > 0
            ? {
                "services.sessionDurations.price": {
                  $gte: minCharge,
                  $lte: maxCharge,
                },
              }
            : {}),
        },
      },

      // Unwind workSamples to filter by tags
      { $unwind: { path: "$workSamples", preserveNullAndEmptyArrays: true } },

      // Filter by tags (from WorkSample model)
      ...(tags && tags.length > 0
        ? [
            {
              $match: {
                "workSamples.tags": { $in: tags },
              },
            },
          ]
        : []),

      // Group back to reconstruct the vendor document
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          email: { $first: "$email" },
          profileImage: { $first: "$profileImage" },
          description: { $first: "$description" },
          geoLocation: { $first: "$geoLocation" },
          location: { $first: "$location" },
          languages: { $first: "$languages" },
          services: { $push: "$services" },
          workSamples: { $push: "$workSamples" },
          categories: { $first: "$categories" },
          minCharge: { $min: "$services.sessionDurations.price" },
          maxCharge: { $max: "$services.sessionDurations.price" },
          distance: { $first: "$distance" }, // Include distance if $geoNear was used
        },
      },

      // Filter out vendors with no valid services after price filtering
      {
        $match: {
          services: { $ne: [] }, // Ensure vendors have at least one matching service
        },
      },

      // Sort
      {
        $sort: sort, // Apply user-specified sort (e.g., { minCharge: 1 })
      },

      // Pagination
      { $skip: skip },
      { $limit: limit },

      // Project final fields
      {
        $project: {
          name: 1,
          email: 1,
          profileImage: 1,
          description: 1,
          geoLocation: 1,
          languages: 1,
          location: 1,
          services: 1,
          workSamples: 1,
          categories: 1,
          minCharge: 1,
          maxCharge: 1,
          distance: 1, // Include distance in output
        },
      }
    );

    // Count pipeline
    const countPipeline: any[] = [];

    // Add geospatial filter for count if geoLocation is provided
    if (geoLocation && geoLocation.coordinates.length > 0) {
      countPipeline.push({
        $match: {
          ...matchStage,
          geoLocation: {
            $geoWithin: {
              $centerSphere: [
                [geoLocation.coordinates[0], geoLocation.coordinates[1]],
                10000 / 6378137, // 10km radius in radians (Earth radius ~6378.137km)
              ],
            },
          },
        },
      });
    } else {
      countPipeline.push({ $match: matchStage });
    }

    // Continue building count pipeline
    countPipeline.push(
      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "vendor",
          as: "services",
        },
      },
      { $unwind: { path: "$services", preserveNullAndEmptyArrays: true } },
      {
        $unwind: {
          path: "$services.sessionDurations",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          ...(minCharge !== undefined && minCharge > 0
            ? { "services.sessionDurations.price": { $gte: minCharge } }
            : {}),
          ...(maxCharge !== undefined && maxCharge > 0
            ? { "services.sessionDurations.price": { $lte: maxCharge } }
            : {}),
        },
      },
      {
        $lookup: {
          from: "worksamples",
          localField: "_id",
          foreignField: "vendor",
          as: "workSamples",
        },
      },
      { $unwind: { path: "$workSamples", preserveNullAndEmptyArrays: true } },
      ...(tags && tags.length > 0
        ? [
            {
              $match: {
                "workSamples.tags": { $in: tags },
              },
            },
          ]
        : []),
      { $group: { _id: "$_id" } },
      { $count: "total" }
    );

    // Execute aggregation and count
    const [vendors, count] = await Promise.all([
      this.model.aggregate(pipeline),
      this.model
        .aggregate(countPipeline)
        .then((result) => result[0]?.total || 0),
    ]);

    return {
      data: vendors,
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

    const aggregatedData = await Vendor.aggregate(pipeline).exec();
    const result: {
      _id: string;
      services: IService[];
      totalServices: number;
    } = aggregatedData[0];
    return {
      data: result.services,
      total: result.totalServices,
    };
  }

  async getPaginatedWorkSamples(
    vendorId: Types.ObjectId,
    page: number,
    limit: number
  ): Promise<PaginatedResult<IWorkSample>> {
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
    return {
      data: result.samples,
      total: result.totalSamples,
    };
  }
}
