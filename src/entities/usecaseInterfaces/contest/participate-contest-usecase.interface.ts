import { IContestUploadEntity } from "../../models/contest-upload.entity";

export interface IParticipateContestUsecase {
    execute(data : Partial<IContestUploadEntity>) : Promise<void>
}