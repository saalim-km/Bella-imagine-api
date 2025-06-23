import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { ICommunityPost } from "../../domain/models/community-post";
import { CommunityPost } from "../database/schemas/community-post.schema";
import { ICommunityPostRepository } from "../../domain/interfaces/repository/community-post.repository";

@injectable()
export class CommunityPostRepository extends BaseRepository<ICommunityPost> implements ICommunityPostRepository {
    constructor(){
        super(CommunityPost)
    }
}