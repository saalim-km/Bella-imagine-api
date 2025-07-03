import { Types } from "mongoose";
import {
  IComment,
  ICommunity,
  ICommunityMember,
  ICommunityPost,
} from "../../models/community";
import { CommunityMembersOutput, FetchCommunityBySlugOutput, GetCommentUsecaseInput, GetPostDetailsInput, GetPostForUserOutput, GetPostUsecaseInput } from "../../types/community.types";
import { PaginatedResponse } from "./types/common.types";
import {
  AddCommentInput,
  CreateCommunityInput,
  CreatePostInput,
  DeletePostInput,
  EditCommentInput,
  EditPostInput,
  FetchAllCommunitiesInput,
  fetchCommBySlugInput,
  FetchCommuityInput,
  GetAllPostInput,
  GetCommunityMemberInput,
  JoinCommunityInput,
  LeaveCommunityInput,
  LikePostInput,
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
  ): Promise<PaginatedResponse<CommunityMembersOutput>>;
}

export interface ICommunityCommandUsecase {
  createNewCommunity(input: CreateCommunityInput): Promise<void>;
  updateCommunity(input: UpdateCommunityInput): Promise<void>;
  joinCommunity(input: JoinCommunityInput): Promise<void>;
  leaveCommunity(input: LeaveCommunityInput): Promise<void>;
}

export interface ICommunityPostCommandUsecase {
  createPost(input: CreatePostInput): Promise<ICommunityPost>;
  likePost(input : LikePostInput):  Promise<{success : boolean}>
  unLikePost(input : LikePostInput): Promise<{success : boolean}>
  editPost(input: EditPostInput): Promise<void>;
  // deletePost(input: DeletePostInput): Promise<void>;
  addComment(input: AddCommentInput): Promise<void>;
  editComment(input : EditCommentInput) : Promise<void>
  deleteComment(commentId : Types.ObjectId) : Promise<void>
  deletePost(postId : Types.ObjectId) : Promise<void>
}

export interface ICommunityPostQueryUsecase {
  getAllPost(
    input: GetAllPostInput
  ): Promise<PaginatedResponse<any>>;
  getPostDetails(input : GetPostDetailsInput) : Promise<any>
  getAllCommentsForUser(input : GetCommentUsecaseInput) : Promise<PaginatedResponse<IComment>>
  getAllPostForUser(input : GetPostUsecaseInput):Promise<PaginatedResponse<GetPostForUserOutput>>
}
