import { inject, injectable } from "tsyringe";
import { IParticipateContestUsecase } from "../../entities/usecaseInterfaces/contest/participate-contest-usecase.interface";
import { IContestUploadEntity } from "../../entities/models/contest-upload.entity";
import { IParticipateContestRepository } from "../../entities/repositoryInterfaces/contest/participate-contest.repository";
import { IContestRepository } from "../../entities/repositoryInterfaces/contest/contest-repository.interface";
import { TRole } from "../../shared/constants";

@injectable()
export class ParticipateContestUsecase implements IParticipateContestUsecase {
    constructor(
        @inject('IParticipateContestRepository') private participateContestRepository : IParticipateContestRepository,
        @inject('IContestRepository') private contestRepository : IContestRepository
    ) {}

    async execute(data : IContestUploadEntity , userRole : TRole): Promise<void> {
        const contest = await this.contestRepository.findById(data.contestId);

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

        if(userRole === 'client') {
            contest?.clientParticipants.push()
        }
    }
}