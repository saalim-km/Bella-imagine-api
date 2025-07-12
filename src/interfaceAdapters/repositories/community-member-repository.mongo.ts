import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { CommunityMember } from "../database/schemas/community-member.schema";
import { ICommunityMemberRepository } from "../../domain/interfaces/repository/community.repository";
import { ICommunityMember } from "../../domain/models/community";
import { FilterQuery } from "mongoose";
import { CommunityMembersOutput } from "../../domain/types/community.types";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";

@injectable()
export class CommunityMemberRepository extends BaseRepository<ICommunityMember> implements ICommunityMemberRepository {
    constructor(){
        super(CommunityMember)
    }

    async findMembers(filter: FilterQuery<ICommunityMember>, skip: number, sort: number, limit: number): Promise<PaginatedResponse<CommunityMembersOutput>> {
        console.log(filter,skip,sort,limit);
        const [count,members] = await Promise.all([
            this.count(filter),
            this.model.aggregate([
                {$match : filter},
                {
                    $lookup : {
                        from :'clients',
                        localField : 'userId',
                        foreignField : '_id',
                        as : 'clientData'
                    }
                },
                {
                    $lookup : {
                        from : 'vendors',
                        localField :'userId',
                        foreignField : '_id',
                        as : 'vendorData'
                    }
                },
            ])
        ])

        console.log(members,count);

        return {
            data : members,
            total : count
        }
    }
}