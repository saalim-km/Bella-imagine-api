import { IClient } from "../../models/client";
import { IBaseRepository } from "./base.repository";
import { IBaseUserRepository } from "./base-user.repository";
import { PaginatedResponse } from "../usecase/types/common.types";
import { GetQueryInput } from "../../types/admin.type";

export interface IClientRepository extends IBaseUserRepository<IClient> , IBaseRepository<IClient> {
    findAdmin(email : string) : Promise<IClient | null>
    findAllClients(input : GetQueryInput) : Promise<PaginatedResponse<IClient>>
}