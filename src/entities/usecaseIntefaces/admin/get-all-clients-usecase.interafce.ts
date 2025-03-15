import { PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { IClientEntity } from "../../models/client.entity";

export interface IGetAllClientUsecase {
    execute(filters ?: Partial<IClientEntity> ,page ?: number , limit ?: number ) : Promise<PaginatedResponse<IClientEntity>>
}