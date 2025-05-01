import { injectable } from "tsyringe";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/community-contest/community-repository.interface";
import { ICommunityEntity } from "../../../entities/models/community.entity";
import { CommunityModel } from "../../../frameworks/database/schemas/community.schema";
import { PaginatedResponse } from "../../../shared/types/admin/admin.type";

@injectable()
export class ComminityRepository implements ICommunityRepository {
  async create(dto: Partial<ICommunityEntity>): Promise<void> {
    await CommunityModel.create(dto);
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<PaginatedResponse<ICommunityEntity>> {
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count of communities
    const total = await CommunityModel.countDocuments();

    // Get paginated communities
    const communities = await CommunityModel.find()
      .skip(skip)
      .limit(limit)
      .lean()
      .sort({createdAt : -1})

    return {
      data : communities,
      total,
    };
  }

  async delete(communityId: string): Promise<void> {
    await CommunityModel.findByIdAndDelete(communityId)
  }
  
  async findBySlug(slug: string): Promise<ICommunityEntity | null> {
    return await CommunityModel.findOne({slug : slug})
  }

  async updateCommunity(communityId: string, dto: Partial<ICommunityEntity>): Promise<void> {
    await CommunityModel.findByIdAndUpdate(communityId, dto)
  }

  async findById(communityId: string): Promise<ICommunityEntity | null> {
    return await CommunityModel.findById(communityId)
  }
}
