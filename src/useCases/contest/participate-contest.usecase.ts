import { inject, injectable } from "tsyringe";
import { IParticipateContestUsecase } from "../../entities/usecaseInterfaces/contest/participate-contest-usecase.interface";
import { IContestUploadEntity } from "../../entities/models/contest-upload.entity";

@injectable()
export class ParticipateContestUsecase implements IParticipateContestUsecase {
    constructor(
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
    }
}