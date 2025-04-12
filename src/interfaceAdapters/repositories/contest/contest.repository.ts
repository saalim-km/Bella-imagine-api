import { IContest } from "../../../entities/models/contenst.entity";
import { IContestRepository } from "../../../entities/repositoryInterfaces/contest/contest-repository.interface";
import { ContestModel } from "../../../frameworks/database/models/contest.model";

export class ContestRepository implements IContestRepository {
    async create(data: Partial<IContest>): Promise<void> {
        await ContestModel.create(data)
    }

    async findByTitle(title: string): Promise<IContest | null> {
        return await ContestModel.findOne({
            title: { $regex: new RegExp(`^${title.trim()}$`, "i") },
        })
    }
}