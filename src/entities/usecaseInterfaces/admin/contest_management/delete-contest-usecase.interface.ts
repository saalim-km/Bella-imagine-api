import { IContest } from "../../../models/contenst.entity";

export interface IDeleteContestUsecase {
    execute(contestId : string) : Promise<void>
}