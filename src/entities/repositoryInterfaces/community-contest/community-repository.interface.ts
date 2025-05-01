import { PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { ICommunityEntity } from "../../models/community.entity";

export interface ICommunityRepository {
    create(dto : Partial<ICommunityEntity>) : Promise<void>
    findAll(page: number, limit: number): Promise<PaginatedResponse<ICommunityEntity>>
    delete(communityId: string): Promise<void>
    findBySlug(slug : string): Promise<ICommunityEntity | null>
    updateCommunity(communityId: string, dto: Partial<ICommunityEntity>): Promise<void>
    findById(communityId: string): Promise<ICommunityEntity | null>
}