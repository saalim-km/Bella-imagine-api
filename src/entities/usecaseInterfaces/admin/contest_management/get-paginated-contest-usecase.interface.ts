import { PaginatedResponse } from "../../../../shared/types/admin/admin.type";
import { PaginatedRequestContest } from "../../../../shared/types/contest/contest.types";
import { IContest } from "../../../models/contenst.entity";

export interface IGetPaginatedContestUsecase {
    execute(filters ?: PaginatedRequestContest) : Promise<PaginatedResponse<IContest>>
}   