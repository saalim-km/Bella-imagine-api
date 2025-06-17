import { ICommunity } from "../../models/community";
import { FetchAllCommunitiesForUsersInput, FetchAllCommunityInput } from "../../types/community.types";
import { PaginatedResponse } from "../usecase/types/common.types";
import { IBaseRepository } from "./base.repository";

export interface ICommunityRepository extends IBaseRepository<ICommunity> {
    fetchAllCommunity(input : FetchAllCommunityInput) : Promise<PaginatedResponse<ICommunity>>
    findBySlug(slug : string) : Promise<ICommunity | null>
    fetchAllCommunitiesForUsers(input : FetchAllCommunitiesForUsersInput) : Promise<PaginatedResponse<ICommunity>>
}