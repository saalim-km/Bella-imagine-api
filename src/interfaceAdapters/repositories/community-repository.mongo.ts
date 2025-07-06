import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { ICommunity } from "../../domain/models/community";
import { ICommunityRepository } from "../../domain/interfaces/repository/community.repository";
import { Community } from "../database/schemas/community.schema";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";
import {
  FetchAllCommunitiesForUsersInput,
  FetchAllCommunityInput,
} from "../../domain/types/community.types";
import mongoose, { FilterQuery } from "mongoose";

@injectable()
export class CommunityRepository
  extends BaseRepository<ICommunity>
  implements ICommunityRepository
{
  constructor() {
    super(Community);
  }

  async fetchAllCommunity(
    input: FetchAllCommunityInput
  ): Promise<PaginatedResponse<ICommunity>> {
    const { filter, limit, skip } = input;
    let query: FilterQuery<ICommunity> = {};

    if (filter.name && filter.slug) {
      query = {
        ...query,
        $or: [
          { name: { $regex: filter.name, $options: "i" } },
          { slug: { $regex: filter.slug, $options: "i" } },
        ],
      };
    }

    const [community, count] = await Promise.all([
      this.model
        .find(query)
        .populate({ path: "category", select: "title" })
        .skip(skip)
        .limit(limit),
      this.count(query),
    ]);

    return {
      data: community,
      total: count,
    };
  }

  async findBySlug(slug: string): Promise<ICommunity | null> {
    return await this.model
      .findOne({ slug })
      .populate({ path: "category", select: "title" });
  }

  async fetchAllCommunitiesForUsers(
    input: FetchAllCommunitiesForUsersInput
  ): Promise<PaginatedResponse<ICommunity>> {
    console.log('input data : ',input);
    const { filter, limit, skip, sort, membership, userId } = input;

    // Base query for Community collection
    let query: FilterQuery<ICommunity> = {
      isPrivate : filter.isPrivate
    };

    // Apply category filter
    if (filter.category && filter.category !== "all") {
      query.category = filter.category;
    }

    // Apply search filter for name, slug, or description
    if (filter.name || filter.slug || filter.description) {
      const searchConditions = [];
      if (filter.name) {
        searchConditions.push({ name: { $regex: filter.name, $options: "i" } });
      }
      if (filter.slug) {
        searchConditions.push({ slug: { $regex: filter.slug, $options: "i" } });
      }
      if (filter.description) {
        searchConditions.push({
          description: { $regex: filter.description, $options: "i" },
        });
      }
      if (searchConditions.length > 0) {
        query = { ...query, $or: searchConditions };
      }
    }

    // Aggregation pipeline
    const pipeline: any[] = [
      // Match base query conditions
      { $match: query },

      // Lookup to join with CommunityMember collection
      {
        $lookup: {
          from: "communitymembers", 
          let: { communityId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$communityId", "$$communityId"] },
                    { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                  ],
                },
              },
            },
          ],
          as: "membershipInfo",
        },
      },

      // Add isMember field based on membershipInfo
      {
        $addFields: {
          isMember: { $gt: [{ $size: "$membershipInfo" }, 0] },
        },
      },

      // Apply membership filter
      ...(membership
        ? [
            {
              $match: {
                isMember: membership === "member" ? true : false,
              },
            },
          ]
        : []),

      // Project relevant fields
      {
        $project: {
          membershipInfo: 0, // Exclude membershipInfo from final output
        },
      },

      // Apply sorting
      ...(sort
        ? [
            {
              $sort: sort,
            },
          ]
        : []),

      // Apply pagination
      { $skip: skip || 0 },
      { $limit: limit || 6 },
    ];

    // Execute aggregation
    const communities = await Community.aggregate(pipeline);

    // Get total count for pagination (without skip/limit)
    const countPipeline = [
      { $match: query },
      {
        $lookup: {
          from: "communitymembers",
          let: { communityId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$communityId", "$$communityId"] },
                    { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                  ],
                },
              },
            },
          ],
          as: "membershipInfo",
        },
      },
      {
        $addFields: {
          isMember: { $gt: [{ $size: "$membershipInfo" }, 0] },
        },
      },
      ...(membership
        ? [
            {
              $match: {
                isMember: membership === "member" ? true : false,
              },
            },
          ]
        : []),
      { $count: "total" },
    ];

    const countResult = await Community.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    return {
      data: communities,
      total,
    };
  }
}
