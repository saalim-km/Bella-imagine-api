import { ICommunityEntity } from "../../../models/community.entity";

export interface IFindCommunityBySlugUsecase {
    execute(slug: string , userId ?: string ): Promise<{community : ICommunityEntity , isMember : boolean}>
}