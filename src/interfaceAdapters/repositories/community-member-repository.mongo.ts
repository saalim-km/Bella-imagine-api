import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { ICommunityMember } from "../../domain/models/community-member";
import { CommunityMember } from "../database/schemas/community-member.schema";
import { ICommunityMemberRepository } from "../../domain/interfaces/repository/community-member.repository";

@injectable()
export class CommunityMemberRepository extends BaseRepository<ICommunityMember> implements ICommunityMemberRepository {
    constructor(){
        super(CommunityMember)
    }
}