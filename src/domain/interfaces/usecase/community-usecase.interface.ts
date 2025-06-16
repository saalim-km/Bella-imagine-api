import { ICommunity } from "../../models/community";
import { FetchCommunityBySlugOutput } from "../../types/community.types";
import { PaginatedResponse } from "./types/common.types";
import {
  CreateCommunityInput,
  fetchCommBySlugInput,
  FetchCommuityInput,
  UpdateCommunityInput,
} from "./types/community.types";

export interface ICommunityQueryUsecase {
  fetchCommunity(
    input: FetchCommuityInput
  ): Promise<PaginatedResponse<ICommunity>>;
  fetchCommunityDetailsBySlug(input : fetchCommBySlugInput) : Promise<FetchCommunityBySlugOutput>
}

export interface ICommunityCommandUsecase {
  createNewCommunity(input: CreateCommunityInput): Promise<void>;
  updateCommunity(input : UpdateCommunityInput) : Promise<void>
}
