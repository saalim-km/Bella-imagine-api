import { PaginatedResponse } from "../../../../shared/types/admin/admin.type";
import { ICommunityEntity } from "../../../models/community.entity";

export interface IGetAllCommunityUsecase {
    execute(dto : {page : number , limit : number}): Promise<PaginatedResponse<ICommunityEntity>>
}