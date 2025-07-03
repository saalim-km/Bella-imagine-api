import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { CommunityPost } from "../database/schemas/community-post.schema";
import { IComment, ICommunityPost } from "../../domain/models/community";
import { ICommunityPostRepository } from "../../domain/interfaces/repository/community.repository";
import {
  GetPostDetailsInput,
  GetPostForUserInput,
  GetPostForUserOutput,
  ICommunityPostResponse,
  PostDetailsResponse,
} from "../../domain/types/community.types";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";
import { FilterQuery, Types } from "mongoose";
import { Like } from "../database/schemas/like.schema";
import { Comment } from "../database/schemas/community-post-comment.schema";

@injectable()
export class CommunityPostRepository
  extends BaseRepository<ICommunityPost>
  implements ICommunityPostRepository
{
  constructor() {
    super(CommunityPost);
  }

  async fetchAllPost(
    filter: FilterQuery<ICommunityPost>,
    userId: Types.ObjectId,
    skip: number,
    limit: number,
    sort: any = -1
  ): Promise<PaginatedResponse<any>> {
    try {
      console.log("user id is here :", userId);
      const [posts, count] = await Promise.all([
        this.model
          .find(filter)
          .populate({
            path: "userId",
            select: "name profileImage",
          })
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: sort })
          .lean()
          .exec(),
        this.model.countDocuments(filter),
      ]);

      if (posts.length === 0) {
        return {
          data: [],
          total: count,
        };
      }

      // Get all post IDs
      const postIds = posts.map((post) => post._id);

      // Get likes and like counts in parallel
      const [userLikes, likeCounts] = await Promise.all([
        // Find all likes for these posts by the current user
        Like.aggregate([
          {
            $match: {
              postId: { $in: postIds },
              userId: userId, // Add userId filter here to get only current user's likes
            },
          },
          {
            $project: {
              postId: 1,
              userId: 1,
            },
          },
        ]),

        // Get like counts for all posts
        Like.aggregate([
          {
            $match: {
              postId: { $in: postIds },
            },
          },
          {
            $group: {
              _id: "$postId",
              count: { $sum: 1 },
            },
          },
        ]),
      ]);

      const parsedUserId = String(userId);
      console.log("string user id :", parsedUserId);
      console.log("userLikes:", userLikes);
      console.log("postIds:", postIds);

      // Create a Set of liked post IDs for efficient lookup
      // Since we already filtered by userId in the aggregation, we only need to check postIds
      const likedPostIds = new Set(
        userLikes.map((like) => String(like.postId))
      );

      console.log("liked post ids:", likedPostIds);

      // Create a Map of like counts for efficient lookup
      const likeCountMap = new Map(
        likeCounts.map((item) => [item._id.toString(), item.count])
      );

      // Map posts to include isLiked flag and like count
      const postsWithLikes = posts.map((post) => {
        const postIdStr = String(post._id);
        return {
          ...post,
          isLiked: likedPostIds.has(postIdStr), // Simplified logic
          likeCount: likeCountMap.get(postIdStr) || 0,
        };
      });

      return {
        data: postsWithLikes,
        total: count,
      };
    } catch (error: any) {
      console.error("Error in fetchAllPost:", error);
      throw new Error(`Failed to fetch posts: ${error.message}`);
    }
  }

  async fetchPostDetails(
    input: GetPostDetailsInput
  ): Promise<PostDetailsResponse> {
    const { postId, userId, limit, page } = input;
    const skip = (page - 1) * limit;

    const [post, totalComments] = await Promise.all([
      this.model.aggregate([
        {
          $match: {
            _id: postId,
          },
        },
        {
          $lookup: {
            from: "comments",
            let: { postId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$postId", "$$postId"] },
                },
              },
              {
                $sort: { createdAt: -1 },
              },
              { $skip: skip },
              { $limit: limit },

              // Lookup from clients
              {
                $lookup: {
                  from: "clients",
                  localField: "userId",
                  foreignField: "_id",
                  as: "clientUser",
                },
              },
              // Lookup from vendors
              {
                $lookup: {
                  from: "vendors",
                  localField: "userId",
                  foreignField: "_id",
                  as: "vendorUser",
                },
              },
              // Merge users
              {
                $addFields: {
                  mergedUser: {
                    $cond: [
                      { $gt: [{ $size: "$clientUser" }, 0] },
                      { $arrayElemAt: ["$clientUser", 0] },
                      { $arrayElemAt: ["$vendorUser", 0] },
                    ],
                  },
                },
              },
              // Extract user fields
              {
                $addFields: {
                  userName: "$mergedUser.name",
                  avatar: "$mergedUser.profileImage",
                },
              },
              {
                $project: {
                  clientUser: 0,
                  vendorUser: 0,
                  mergedUser: 0,
                },
              },
            ],
            as: "comments",
          },
        },

        // Likes lookup
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "postId",
            as: "likes",
          },
        },

        // Lookup post creator from clients
        {
          $lookup: {
            from: "clients",
            localField: "userId",
            foreignField: "_id",
            as: "clientUser",
          },
        },
        // Lookup post creator from vendors
        {
          $lookup: {
            from: "vendors",
            localField: "userId",
            foreignField: "_id",
            as: "vendorUser",
          },
        },
        // Merge post creator (merging the user who put the post)
        {
          $addFields: {
            mergedUser: {
              $cond: [
                { $gt: [{ $size: "$clientUser" }, 0] },
                { $arrayElemAt: ["$clientUser", 0] },
                { $arrayElemAt: ["$vendorUser", 0] },
              ],
            },
          },
        },
        {
          $addFields: {
            userName: "$mergedUser.name",
            avatar: "$mergedUser.profileImage",
          },
        },
        {
          $project: {
            clientUser: 0,
            vendorUser: 0,
            mergedUser: 0,
          },
        },

        // find  isLiked or not
        {
          $addFields: {
            isLiked: {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: "$likes",
                      as: "like",
                      cond: {
                        $eq: ["$$like.userId", userId],
                      },
                    },
                  },
                },
                0,
              ],
            },
          },
        },

        // Final shape
        {
          $project: {
            media: 1,
            title: 1,
            content: 1,
            userId: 1,
            mediaType: 1,
            isEdited: 1,
            likeCount: 1,
            tags: 1,
            comments: 1,
            createdAt: 1,
            updatedAt: 1,
            isLiked: 1,
            userName: 1,
            avatar: 1,
          },
        },
      ]),
      Comment.countDocuments({ postId }),
    ]);

    return {
      ...post[0],
      totalComments,
    };
  }

  async fetchAllPostForUser(input: GetPostForUserInput): Promise<PaginatedResponse<GetPostForUserOutput>> {
    const {filter,limit,skip,sort} = input;
    const sortOrder: 1 | -1 = sort === 1 ? 1 : -1;
    console.log(filter);
    const [post , count] = await Promise.all([
      this.model.aggregate([
        {
          $match : filter
        },
        {$skip : skip},
        {$limit : limit},
        {$sort : {createdAt : sortOrder}},
        {
          $lookup : {
            from : 'communities',
            localField : 'communityId',
            foreignField : '_id',
            as : 'community'
          }
        },
        {
          $unwind : {
            path : '$community'
          }
        },
        {
          $addFields : {
            communityName : '$community.name',
            iconImage : '$community.iconImage',
            coverImage : '$community.coverImage'
          }
        },
        {
          $project : {
            "community" : 0
          }
        }
      ]),
      this.count(filter)
    ])
    
    return {
      data : post,
      total : count
    }
  }

  async deleteCommunityPost(postId: Types.ObjectId): Promise<void> {
    await Promise.all([
      Comment.deleteMany({postId : postId}),
      this.model.findByIdAndDelete(postId)
    ])
  }
}
