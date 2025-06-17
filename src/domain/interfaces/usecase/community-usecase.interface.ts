import { ICommunity } from "../../models/community";
import { FetchCommunityBySlugOutput } from "../../types/community.types";
import { PaginatedResponse } from "./types/common.types";
import {
  CreateCommunityInput,
  FetchAllCommunitiesInput,
  fetchCommBySlugInput,
  FetchCommuityInput,
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
}

export interface ICommunityCommandUsecase {
  createNewCommunity(input: CreateCommunityInput): Promise<void>;
  updateCommunity(input : UpdateCommunityInput) : Promise<void>
  joinCommunity(input : JoinCommunityInput) : Promise<void>
  leaveCommunity(input : LeaveCommunityInput) : Promise<void>
}
