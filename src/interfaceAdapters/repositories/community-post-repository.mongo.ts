import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { CommunityPost } from "../database/schemas/community-post.schema";
import { ICommunityPost } from "../../domain/models/community";
import { ICommunityPostRepository } from "../../domain/interfaces/repository/community.repository";
import { FilterQuery, Types } from "mongoose";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";
import { ICommunityPostResponse } from "../../domain/types/community.types";
import { Like } from "../database/schemas/like.schema";

@injectable()
export class CommunityPostRepository extends BaseRepository<ICommunityPost> implements ICommunityPostRepository {
    constructor(){
        super(CommunityPost)
    }

async fetchAllPost(
    filter: FilterQuery<ICommunityPost>,
    skip: number,
    limit: number,
    userId: string,
    sort: any = -1
): Promise<PaginatedResponse<any>> {
    const [posts, count] = await Promise.all([
        this.model
            .find(filter)
            .populate({
                path: 'userId',
                select: 'name profileImage'
            })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: sort })
            .lean()
            .exec(),
        this.model.countDocuments(filter)
    ]);

    // Get all post IDs
    const postIds = posts.map(post => post._id);

    // Find all likes for these posts by the user
    const likes = await Like.find({
        postId: { $in: postIds },
        userId: new Types.ObjectId(userId)
    }).lean();

    // Create a Set of liked post IDs for efficient lookup
    const likedPostIds = new Set(likes.map(like => like.postId.toString()));

    // Map posts to include isLiked flag
    const postsWithLikes = posts.map(post => ({
        ...post,
        isLiked: likedPostIds.has(post._id.toString())
    }));

    console.log('got the posts : ', postsWithLikes, count);
    return {
        data: postsWithLikes,
        total: count
    };
}

}