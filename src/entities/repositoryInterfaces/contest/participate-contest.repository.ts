import { IContestUploadEntity } from "../../models/contest-upload.entity";

export interface IParticipateContestRepository {
    participateContest(data : Partial<IContestUploadEntity>): Promise<void>
}