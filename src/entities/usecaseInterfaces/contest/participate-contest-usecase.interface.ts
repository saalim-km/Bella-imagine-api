import { TRole } from "../../../shared/constants";
import { IContestUploadEntity } from "../../models/contest-upload.entity";

export interface IParticipateContestUsecase {
    execute(data : Partial<IContestUploadEntity> , userRole : TRole) : Promise<void>
}