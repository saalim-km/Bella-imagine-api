import { ICommunityEntity } from "../../../models/community.entity";

export interface IUpdateCommunityUsecase {
    execute(communityId: string, dto: Partial<ICommunityEntity>) : Promise<void>
} 