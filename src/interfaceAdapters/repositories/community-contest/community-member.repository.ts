import { injectable } from "tsyringe";
import { ICommunityMemberRepository } from "../../../entities/repositoryInterfaces/community-contest/community-member-repository.interface";
import { ICommunityMemberEntity } from "../../../entities/models/community-members.entity";
import { CommunityMemberModel } from "../../../frameworks/database/schemas/community-member.schema";

@injectable()
export class CommunityMemberRepository implements ICommunityMemberRepository {
    async create(dto: Partial<ICommunityMemberEntity>): Promise<void> {
        await CommunityMemberModel.create(dto)
    }

    async isMember(communityId : string , userId : string): Promise<boolean> {
        const isMember =  await CommunityMemberModel.exists({
            communityId : communityId,
            userId : userId
        })
        console.log('member from community  : ',isMember);
        return !!isMember;
    }

    async deleteMember(communityId: string, userId: string): Promise<void> {
        await CommunityMemberModel.deleteOne({
            communityId : communityId,
            userId : userId
        })
    }
}