import { ICommunityEntity } from "../../models/community.entity";

export interface ICommunityRepository {
    create(dto : Partial<ICommunityEntity>) : Promise<void>
}