import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { IComment } from "../../domain/models/community";
import { ICommentRepository } from "../../domain/interfaces/repository/community.repository";
import { Comment } from "../database/schemas/community-post-comment.schema";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";
import { GetComentsInput } from "../../domain/types/community.types";
import { PopulateOption } from "mongoose";

@injectable()
export class CommentRepository
  extends BaseRepository<IComment>
  implements ICommentRepository
{
  constructor() {
    super(Comment);
  }

  async fetchCommentsByUserId(
    input: GetComentsInput
  ): Promise<PaginatedResponse<IComment>> {
    const { limit, skip, userId } = input;

    const [comments, count] = await Promise.all([
      this.model.aggregate([
        {
          $match: { userId: userId },
        },
        {
          $sort: { createdAt: -1 },
        },
        { $skip: skip },
        { $limit: limit },
        {
            $lookup : {
                from : 'communityposts',
                localField : 'postId',
                foreignField : '_id',
                as : 'post'
            }
        }
      ]),
      this.count({ userId: userId }),
    ]);

    console.log("got the user comments here", comments);

    return {
        data : comments,
        total : count
    }
  }
}
