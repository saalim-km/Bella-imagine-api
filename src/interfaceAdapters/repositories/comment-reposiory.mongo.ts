import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { IComment } from "../../domain/models/community";
import { ICommentRepository } from "../../domain/interfaces/repository/community.repository";
import { Comment } from "../database/schemas/community-post-comment.schema";

@injectable()

export class CommentRepository extends BaseRepository<IComment> implements ICommentRepository {
    constructor(){
        super(Comment)
    }
}