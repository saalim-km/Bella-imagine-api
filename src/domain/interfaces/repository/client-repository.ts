import { IAdmin } from "../../models/admin";
import { IClient } from "../../models/client";
import { IBaseRepository } from "./base-repository";
import { IBaseUserRepository } from "./base-user-repository";

export interface IClientRepository extends IBaseUserRepository<IClient> , IBaseRepository<IClient> {
    findAdmin(email : string) : Promise<IClient | null  >
}