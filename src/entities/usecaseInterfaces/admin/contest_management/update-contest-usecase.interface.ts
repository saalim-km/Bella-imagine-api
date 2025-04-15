import { IContest } from "../../../models/contenst.entity";

export interface IUpdateContestUsecase {
    execute(contestId : string , data : Partial<IContest>) : Promise<void>
}