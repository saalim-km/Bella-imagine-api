import { ICommunityMemberEntity } from "../../models/community-members.entity";

export interface ICommunityMemberRepository {
    create(dto : Partial<ICommunityMemberEntity>) : Promise<void>
    isMember(communityId : string , userId : string) : Promise<boolean>
    deleteMember(communityId : string , userId : string) : Promise<void>
}