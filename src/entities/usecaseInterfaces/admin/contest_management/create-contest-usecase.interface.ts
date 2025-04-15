import { IContest } from "../../../models/contenst.entity";

export interface ICreateContestUsecase {
    execute(data : Partial<IContest>) : Promise<void>
}