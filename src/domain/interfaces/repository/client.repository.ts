import { IClient } from "../../models/client";
import { IBaseRepository } from "./base.repository";
import { IBaseUserRepository } from "./base-user.repository";
import { PaginatedResponse } from "../usecase/types/common.types";
import { GetUsersInput } from "../../types/admin.type";

export interface IClientRepository extends IBaseUserRepository<IClient> , IBaseRepository<IClient> {
    findAdmin(email : string) : Promise<IClient | null>
    findAllClients(input : GetUsersInput) : Promise<PaginatedResponse<IClient>>
}