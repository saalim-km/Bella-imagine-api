import { PaginatedResponse } from "../../../../shared/types/admin/admin.type";
import { PaginatedRequestContest } from "../../../../shared/types/contest/contest.types";
import { IContest } from "../../../models/contenst.entity";

export interface IGetPaginatedContestUsecase {
    execute(page : number , limit : number , filters ?: PaginatedRequestContest) : Promise<PaginatedResponse<IContest>>
}   