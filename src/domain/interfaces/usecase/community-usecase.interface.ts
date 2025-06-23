import { Types } from "mongoose";
import {
  ICommunity,
  ICommunityMember,
  ICommunityPost,
} from "../../models/community";
import { FetchCommunityBySlugOutput } from "../../types/community.types";
import { PaginatedResponse } from "./types/common.types";
import {
  AddCommentInput,
  CreateCommunityInput,
  CreatePostInput,
  DeletePostInput,
  EditPostInput,
  FetchAllCommunitiesInput,
  fetchCommBySlugInput,
  FetchCommuityInput,
  GetAllPostInput,
  GetCommunityMemberInput,
  JoinCommunityInput,
  LeaveCommunityInput,
  UpdateCommunityInput,
} from "./types/community.types";

export interface ICommunityQueryUsecase {
  fetchCommunity(
    input: FetchCommuityInput
  ): Promise<PaginatedResponse<ICommunity>>;
  fetchCommunityDetailsBySlug(
    input: fetchCommBySlugInput
  ): Promise<FetchCommunityBySlugOutput>;
  fetchAllCommunities(
    input: FetchAllCommunitiesInput
  ): Promise<PaginatedResponse<ICommunity>>;
  fetchCommuityMembers(
    input: GetCommunityMemberInput
  ): Promise<PaginatedResponse<ICommunityMember>>;
}

export interface ICommunityCommandUsecase {
  createNewCommunity(input: CreateCommunityInput): Promise<void>;
  updateCommunity(input: UpdateCommunityInput): Promise<void>;
  joinCommunity(input: JoinCommunityInput): Promise<void>;
  leaveCommunity(input: LeaveCommunityInput): Promise<void>;
}

export interface ICommunityPostCommandUsecase {
  createPost(input: CreatePostInput): Promise<ICommunityPost>;
  // editPost(input: EditPostInput): Promise<void>;
  // deletePost(input: DeletePostInput): Promise<void>;
  // addComment(input: AddCommentInput): Promise<void>;
}

export interface ICommunityPostQueryUsecase {
  getAllPost(
    input: GetAllPostInput
  ): Promise<PaginatedResponse<ICommunityPost>>;
}
