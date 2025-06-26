import { FilterQuery, Types } from "mongoose";
import { IComment, ICommunity, ICommunityMember, ICommunityPost, ILike } from "../../models/community";
import { FetchAllCommunitiesForUsersInput, FetchAllCommunityInput, ICommunityPostResponse } from "../../types/community.types";
import { PaginatedResponse } from "../usecase/types/common.types";
import { IBaseRepository } from "./base.repository";

export interface ICommunityRepository extends IBaseRepository<ICommunity> {
    fetchAllCommunity(input : FetchAllCommunityInput) : Promise<PaginatedResponse<ICommunity>>
    findBySlug(slug : string) : Promise<ICommunity | null>
    fetchAllCommunitiesForUsers(input : FetchAllCommunitiesForUsersInput) : Promise<PaginatedResponse<ICommunity>>
}

export interface ICommunityPostRepository extends IBaseRepository<ICommunityPost> {
    fetchAllPost(filter: FilterQuery<ICommunityPost>,userId : Types.ObjectId,skip: number, limit: number, sort: any) : Promise<PaginatedResponse<ICommunityPostResponse>>
}

export interface ICommunityMemberRepository extends IBaseRepository<ICommunityMember>  {
}

export interface ICommentRepository extends IBaseRepository<IComment> {
}

export interface ILikeRepository extends IBaseRepository<ILike> {
}