import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { CommunityPost } from "../database/schemas/community-post.schema";
import { ICommunityPost } from "../../domain/models/community";
import { ICommunityPostRepository } from "../../domain/interfaces/repository/community.repository";
import { ICommunityPostResponse } from "../../domain/types/community.types";
import logger from "../../shared/logger/logger";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";
import { FilterQuery, Types } from "mongoose";
import { Like } from "../database/schemas/like.schema";

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
}
