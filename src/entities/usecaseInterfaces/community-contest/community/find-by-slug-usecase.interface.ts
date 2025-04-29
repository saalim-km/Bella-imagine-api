import { ICommunityEntity } from "../../../models/community.entity";

export interface IFindCommunityBySlugUsecase {
    execute(slug: string): Promise<ICommunityEntity | null>
}