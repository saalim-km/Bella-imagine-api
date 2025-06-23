import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { CommunityPost } from "../database/schemas/community-post.schema";
import { ICommunityPost } from "../../domain/models/community";
import { ICommunityPostRepository } from "../../domain/interfaces/repository/community.repository";

@injectable()
export class CommunityPostRepository extends BaseRepository<ICommunityPost> implements ICommunityPostRepository {
    constructor(){
        super(CommunityPost)
    }
}