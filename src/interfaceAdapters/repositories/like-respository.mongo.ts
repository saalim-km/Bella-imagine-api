import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { ILike } from "../../domain/models/community";
import { ILikeRepository } from "../../domain/interfaces/repository/community.repository";
import { Like } from "../database/schemas/like.schema";

@injectable()
export class LikeRepository extends BaseRepository<ILike> implements ILikeRepository {
    constructor(){
        super(Like)
    }
}