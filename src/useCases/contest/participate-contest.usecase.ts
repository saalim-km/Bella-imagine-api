import { inject, injectable } from "tsyringe";
import { IParticipateContestUsecase } from "../../entities/usecaseInterfaces/contest/participate-contest-usecase.interface";
import { IContestUploadEntity } from "../../entities/models/contest-upload.entity";
import { IParticipateContestRepository } from "../../entities/repositoryInterfaces/contest/participate-contest.repository";

@injectable()
export class ParticipateContestUsecase implements IParticipateContestUsecase {
    constructor(
        @inject('IParticipateContestRepository') private participateContestRepository : IParticipateContestRepository
    ) {}

    async execute(data : IContestUploadEntity): Promise<void> {
        const contestUpload : Partial<IContestUploadEntity> = {
            title : data.title,
            caption : data.caption,
            categoryId : data.categoryId,
            contestId : data.contestId,
            image : data.image,
            comment : [],
            likeCount : 0,
        }

        await this.participateContestRepository.participateContest(contestUpload)
    }
}