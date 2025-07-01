import { inject, injectable } from "tsyringe";
import { ICommunityQueryUsecase } from "../../domain/interfaces/usecase/community-usecase.interface";
import { ICommunityRepository } from "../../domain/interfaces/repository/community.repository";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";
import {
  FetchAllCommunitiesInput,
  fetchCommBySlugInput,
  FetchCommuityInput,
  GetCommunityMemberInput,
} from "../../domain/interfaces/usecase/types/community.types";
import { ICommunity } from "../../domain/models/community";
import { FilterQuery, Types } from "mongoose";
import { IGetPresignedUrlUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";
import { CommunityMembersOutput, FetchCommunityBySlugOutput } from "../../domain/types/community.types";
import { ICommunityMemberRepository } from "../../domain/interfaces/repository/community.repository";
import { skip } from "node:test";
import { ICommunityMember } from "../../domain/models/community";

@injectable()
export class CommunityQueryUsecase implements ICommunityQueryUsecase {
  constructor(
    @inject("ICommunityRepository")
    private _communityRepository: ICommunityRepository,
    @inject("IGetPresignedUrlUsecase")
    private _presignedUrl: IGetPresignedUrlUsecase,
    @inject("ICommunityMemberRepository")
    private _communityMemberRepo: ICommunityMemberRepository
  ) {}

  async fetchCommunity(
    input: FetchCommuityInput
  ): Promise<PaginatedResponse<ICommunity>> {
    const { limit, page, search } = input;
    const skip = (page - 1) * limit;
    const filter: FilterQuery<ICommunity> = {};
    if (search && search.trim() !== "") {
      filter.name = search;
      filter.slug = search;
    }

    const { data, total } = await this._communityRepository.fetchAllCommunity({
      filter: filter,
      limit: limit,
      skip: skip,
    });

    const communities = await Promise.all(
      data.map(async (comm, ind) => {
        if (comm.coverImage) {
          comm.coverImage = await this._presignedUrl.getPresignedUrl(
            comm.coverImage
          );
        }
        if (comm.iconImage) {
          comm.iconImage = await this._presignedUrl.getPresignedUrl(
            comm.iconImage
          );
        }
        return comm;
      })
    );

    return {
      data: communities,
      total: total,
    };
  }

  async fetchCommunityDetailsBySlug(
    input: fetchCommBySlugInput
  ): Promise<FetchCommunityBySlugOutput> {
    const { slug, userId } = input;
    if (!slug.includes("r/")) {
      throw new CustomError(
        ERROR_MESSAGES.INVALID_SLUG,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    const community = await this._communityRepository.findBySlug(slug);
    let isMember = null;
    if (community) {
      isMember = await this._communityMemberRepo.findOne({ userId: userId, communityId: community._id });
    }

    console.log('found member from commnity : ',isMember);
    if (!community) {
      throw new CustomError(
        ERROR_MESSAGES.COMMUNITY_NO_EXIST,
        HTTP_STATUS.NOT_FOUND
      );
    }
    if (community.iconImage) {
      community.iconImage = await this._presignedUrl.getPresignedUrl(
        community.iconImage
      );
    }
    if (community.coverImage) {
      community.coverImage = await this._presignedUrl.getPresignedUrl(
        community.coverImage
      );
    }

    return {
      community: community,
      isMember: !!isMember,
    };
  }

  async fetchAllCommunities(
    input: FetchAllCommunitiesInput
  ): Promise<PaginatedResponse<ICommunity>> {
    const { category, membership, search, sort, limit, page } = input;
    const skip = (page - 1) * limit;
    const filter: FilterQuery<ICommunity> = {isPrivate : false};
    if (category && category !== undefined) {
      filter.category = category;
    }
    if (search && search.trim() !== "") {
      filter.name = search;
      filter.slug = search;
      filter.description = search;
    }

    const { data, total } =
      await this._communityRepository.fetchAllCommunitiesForUsers({
        filter: filter,
        limit: limit,
        skip: skip,
        sort: sort,
        userId: input.userId,
        membership : membership
      });

    const communities = await Promise.all(
      data.map(async (comm, ind) => {
        if (comm.coverImage) {
          comm.coverImage = await this._presignedUrl.getPresignedUrl(
            comm.coverImage
          );
        }
        if (comm.iconImage) {
          comm.iconImage = await this._presignedUrl.getPresignedUrl(
            comm.iconImage
          );
        }
        return comm;
      })
    );


    return {
      data : communities,
      total: total
    }
  }

  async fetchCommuityMembers(input : GetCommunityMemberInput): Promise<PaginatedResponse<CommunityMembersOutput>> {
    const {slug,limit,page} = input;
    
    const isCommunityExists = await this._communityRepository.findBySlug(slug)
    if(!isCommunityExists){
      throw new CustomError(ERROR_MESSAGES.COMMUNITY_NO_EXIST,HTTP_STATUS.NOT_FOUND)
    }

    const skip = (page - 1) * limit;

    const filter : FilterQuery<ICommunityMember> = {
      communityId : isCommunityExists._id
    }

    return await this._communityMemberRepo.findMembers(filter,skip,-1,limit)
  }
}
