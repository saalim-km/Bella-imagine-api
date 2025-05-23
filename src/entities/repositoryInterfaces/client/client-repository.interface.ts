import { ObjectId } from "mongoose";
import { PaginatedResponse } from "../../../shared/types/admin/admin.type";
import { IClientEntity } from "../../models/client.entity";
import { IUserEntityForChat } from "../../models/iuser.entity";
import { IClientModel } from "../../../frameworks/database/models/client.model";

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
    updateClientProfileById(id : string | ObjectId   , data : Partial<IClientEntity>) : Promise<any>
    updateOnlineStatus(id: string, isOnline: boolean, lastSeen?: Date): Promise<IUserEntityForChat | null>;
    findByIds(vendorIds: string[]): Promise<IClientModel[]>;
    findByIdAndUpdateOnlineStatus(clientId : string , status : true | false) : Promise<IClientEntity | null>
    updateLastSeen(clientId : string , lastSeen : string) : Promise<void>
}