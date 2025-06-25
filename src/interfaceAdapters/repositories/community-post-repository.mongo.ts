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
    skip: number,
    limit: number,
    userId: string,
    sort: any = -1,
  ): Promise<PaginatedResponse<any>> {
    try {
      // Convert userId to ObjectId for proper comparison
      const userObjectId = new Types.ObjectId(userId)

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
      ])

      if (posts.length === 0) {
        return {
          data: [],
          total: count,
        }
      }

      console.log('got post by users : ',posts);
      // Get all post IDs
      const postIds = posts.map((post) => post._id)

      // Get likes and like counts in parallel
      const [userLikes, likeCounts] = await Promise.all([
        // Find all likes for these posts by the current user
        Like.aggregate([
            {
                $match : {
                    postId : {$in : postIds}
                },
            },
            {
                $project : {
                    postId : 1
                }
            }
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
      ])

      console.log("Got the likes by user:", userLikes)
      console.log("Got like counts:", likeCounts)

      // Create a Set of liked post IDs for efficient lookup
      const likedPostIds = new Set(userLikes.map((like) => like.postId.toString()))

      // Create a Map of like counts for efficient lookup
      const likeCountMap = new Map(likeCounts.map((item) => [item._id.toString(), item.count]))

      // Map posts to include isLiked flag and like count
      const postsWithLikes = posts.map((post) => ({
        ...post,
        isLiked: likedPostIds.has(post._id.toString()),
        likeCount: likeCountMap.get(post._id.toString()) || 0,
      }))

      console.log("Got the posts with likes:", postsWithLikes, count)

      return {
        data: postsWithLikes,
        total: count,
      }
    } catch (error : any) {
      console.error("Error in fetchAllPost:", error)
      throw new Error(`Failed to fetch posts: ${error.message}`)
    }
  }
}
