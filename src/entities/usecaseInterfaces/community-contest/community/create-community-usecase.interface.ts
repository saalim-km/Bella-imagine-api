import { ICommunityMemberEntity } from "../../../models/community-members.entity";
import { ICommunityEntity } from "../../../models/community.entity";

export interface ICreateCommunityUsecase {
    execute(dto : Partial<ICommunityEntity>) : Promise<void>
}