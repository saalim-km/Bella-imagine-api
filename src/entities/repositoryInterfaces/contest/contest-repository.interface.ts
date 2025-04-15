import { PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { IContest } from "../../models/contenst.entity";
import { IContestUploadEntity } from "../../models/contest-upload.entity";

export interface IContestRepository {
    create(data : Partial<IContest>): Promise<void>

    findByTitle(title : string): Promise<IContest | null>

    findById(contestId : string) : Promise<IContest | null>

    findByIdAndUpdateContest(contestId : string , data : Partial<IContest>) : Promise<void>

    findByIdDeleteContest(contestId : string) : Promise<void>

    getAllContest(filters : Record<string , any>, skip: number , limit : number) : Promise<PaginatedResponse<IContest>>
}