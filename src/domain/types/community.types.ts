import { Types } from "mongoose";
import { ICommunity } from "../models/community";
import { PaginationQuery } from "./admin.type";

export interface FetchAllCommunityInput extends Omit<PaginationQuery<ICommunity> , 'sort'> {}

export interface FetchCommunityBySlugOutput {
    community : ICommunity;
    isMember : boolean
}

export interface FetchAllCommunitiesForUsersInput extends Omit<PaginationQuery<ICommunity>,'sort'> {
    membership ?: 'member' | 'non-member'
    sort ?: Record<string,number>
    userId : Types.ObjectId
}