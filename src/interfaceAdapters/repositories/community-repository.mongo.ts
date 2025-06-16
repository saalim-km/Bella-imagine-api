import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { ICommunity } from "../../domain/models/community";
import { ICommunityRepository } from "../../domain/interfaces/repository/community.repository";
import { Community } from "../database/schemas/community.schema";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";
import { FetchAllCommunityInput } from "../../domain/types/community.types";
import { FilterQuery } from "mongoose";

@injectable()
export class CommunityRepository extends BaseRepository<ICommunity> implements ICommunityRepository {
    constructor(){
        super(Community);
    }

    async fetchAllCommunity(input: FetchAllCommunityInput): Promise<PaginatedResponse<ICommunity>> {
        const {filter , limit,skip} = input;
        let query : FilterQuery<ICommunity> = {}

        if(filter.name && filter.slug) {
            query = {
                ...query,
                $or : [{name : {$regex : filter.name , $options :'i' }},
{slug : {$regex : filter.slug , $options : 'i'}}
                ]
            }
        }

        const [community,count] = await Promise.all([
            this.findAll(query,skip,limit),
            this.count(query)
        ])

        return {
            data : community,
            total : count
        }
    }
}