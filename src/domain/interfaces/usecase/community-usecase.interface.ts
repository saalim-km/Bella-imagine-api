import { Types } from "mongoose";
import { ICommunity } from "../../models/community";
import { ICommunityMember } from "../../models/community-member";
import { FetchCommunityBySlugOutput } from "../../types/community.types";
import { PaginatedResponse } from "./types/common.types";
import {
  CreateCommunityInput,
  FetchAllCommunitiesInput,
  fetchCommBySlugInput,
  FetchCommuityInput,
  GetCommunityMemberInput,
  JoinCommunityInput,
  LeaveCommunityInput,
  UpdateCommunityInput,
} from "./types/community.types";

export interface ICommunityQueryUsecase {
  fetchCommunity(
    input: FetchCommuityInput
  ): Promise<PaginatedResponse<ICommunity>>;
  fetchCommunityDetailsBySlug(input : fetchCommBySlugInput) : Promise<FetchCommunityBySlugOutput>
  fetchAllCommunities(input : FetchAllCommunitiesInput) : Promise<PaginatedResponse<ICommunity>>
  fetchCommuityMembers(input : GetCommunityMemberInput) : Promise<PaginatedResponse<ICommunityMember>>
}

export interface ICommunityCommandUsecase {
  createNewCommunity(input: CreateCommunityInput): Promise<void>;
  updateCommunity(input : UpdateCommunityInput) : Promise<void>
  joinCommunity(input : JoinCommunityInput) : Promise<void>
  leaveCommunity(input : LeaveCommunityInput) : Promise<void>
}
