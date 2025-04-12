import { IContest } from "../../models/contenst.entity";

export interface IContestRepository {
    create(data : Partial<IContest>): Promise<void>

    findByTitle(title : string): Promise<IContest | null>
}