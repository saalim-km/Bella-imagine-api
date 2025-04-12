import { IContest } from "../../models/contenst.entity";

export interface IContestRepository {
    create(data : Partial<IContest>): Promise<void>

    findByTitle(title : string): Promise<IContest | null>

    findById(contestId : string) : Promise<IContest | null>

    findByIdAndUpdateContest(contestId : string , data : Partial<IContest>) : Promise<void>

    findByIdDeleteContest(contestId : string) : Promise<void>
}