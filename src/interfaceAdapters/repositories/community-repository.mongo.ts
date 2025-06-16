import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { ICommunity } from "../../domain/models/community";
import { ICommunityRepository } from "../../domain/interfaces/repository/community.repository";
import { Community } from "../database/schemas/community.schema";

@injectable()
export class CommunityRepository extends BaseRepository<ICommunity> implements ICommunityRepository {
    constructor(){
        super(Community);
    }
}