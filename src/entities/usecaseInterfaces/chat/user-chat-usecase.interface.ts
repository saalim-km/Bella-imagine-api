import { TRole } from "../../../shared/constants";

export interface IUpdateUserOnlineStatus {
    execute(userId : string , isOnline : boolean , userType : TRole) : Promise<void>
}