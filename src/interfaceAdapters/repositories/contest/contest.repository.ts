import { IContest } from "../../../entities/models/contenst.entity";
import { IContestRepository } from "../../../entities/repositoryInterfaces/contest/contest-repository.interface";
import { ContestModel } from "../../../frameworks/database/models/contest.model";
import { PaginatedResponse } from "../../../shared/types/admin/admin.type";

export class ContestRepository implements IContestRepository {
    async create(data: Partial<IContest>): Promise<void> {
        await ContestModel.create(data)
    }

    async findByTitle(title: string): Promise<IContest | null> {
        return await ContestModel.findOne({
            title: { $regex: new RegExp(`^${title.trim()}$`, "i") },
        })
    }

    async findById(contestId: string): Promise<IContest | null> {
        return await ContestModel.findById(contestId)
    }

    async findByIdAndUpdateContest(contestId: string, data: Partial<IContest>): Promise<void> {
        await ContestModel.findByIdAndUpdate(contestId,data);
    }

    async findByIdDeleteContest(contestId: string): Promise<void> {
        await ContestModel.findByIdAndDelete(contestId)
    }

    async getAllContest(filters: Record<string, any>, skip: number, limit: number): Promise<PaginatedResponse<IContest>> {
        const [contest,total] = await Promise.all([
            ContestModel.find(filters).sort({createdAt : -1}).skip(skip).limit(limit),
            ContestModel.countDocuments(filters)
        ])

        return {
            data : contest,
            total
        }
    }
}