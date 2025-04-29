import { injectable } from "tsyringe";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/community-contest/community-repository.interface";
import { ICommunityEntity } from "../../../entities/models/community.entity";
import { CommunityModel } from "../../../frameworks/database/schemas/community.schema";

@injectable()
export class ComminityRepository implements ICommunityRepository {
    async create(dto: Partial<ICommunityEntity>): Promise<void> {
        await CommunityModel.create(dto)
    }
}