import { IAdmin } from "../../models/admin";
import { IClient } from "../../models/client";
import { IBaseUserRepository } from "./base-user-repository";

export interface IClientRepository extends IBaseUserRepository<IClient> {
    findAdmin(email : string) : Promise<IClient | null  >
}