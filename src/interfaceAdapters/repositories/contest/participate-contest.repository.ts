import { injectable } from "tsyringe";
import { IParticipateContestRepository } from "../../../entities/repositoryInterfaces/contest/participate-contest.repository";
import { IContestUploadEntity } from "../../../entities/models/contest-upload.entity";
import { ContestUploadModel } from "../../../frameworks/database/models/participate-contest.model";

@injectable()
export class ParticipateContestRepository implements IParticipateContestRepository {
    async participateContest(data : Partial<IContestUploadEntity>): Promise<void> {
        await ContestUploadModel.create(data)
    }
}