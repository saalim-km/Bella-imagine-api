import { ICommunityMemberEntity } from "../../../models/community-members.entity";

export interface ICreateCommunityMemberUsecase {
    execute(dto: Partial<ICommunityMemberEntity>): Promise<void>
}