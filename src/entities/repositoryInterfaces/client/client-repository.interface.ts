import { IClientEntity } from "../../models/client.entity";

export interface IClientRepository {
    save(data : IClientEntity) : Promise<IClientEntity>
    find(
        filter : Record<string,any>,
        skip : number,
        limit : number,
    ) : Promise<{user : IClientEntity[] | [] ; total : number}>
    findByEmail(email : string) : Promise<IClientRepository | null>
    findById(id : string) : Promise<IClientRepository | null>
    findByIdAndUpdatePassword(id : string , password : string) : Promise<void>
    updateClientProfileById(id : string , data : Partial<IClientEntity>) : Promise<void>
}