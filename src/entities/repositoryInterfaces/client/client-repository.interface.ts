import { PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { IClientEntity } from "../../models/client.entity";

export interface IClientRepository {
    save(data : IClientEntity) : Promise<IClientEntity>
    find(
        filter : Record<string,any>,
        skip : number,
        limit : number,
        sort ?: any 
    ) : Promise<PaginatedResponse<IClientEntity>>
    findByEmail(email : string) : Promise<IClientEntity | null>
    findById(id : any) : Promise<IClientEntity | null>
    findByIdAndUpdatePassword(id : string , password : string) : Promise<void>
    updateClientProfileById(id : string , data : Partial<IClientEntity>) : Promise<void>
}