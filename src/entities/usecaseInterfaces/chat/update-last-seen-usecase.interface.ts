import { TRole } from "../../../shared/constants";

export interface IUpdateLastSeenUsecase {
    execute(userId : string , lastSeen : string , userType : TRole): Promise<void>
}