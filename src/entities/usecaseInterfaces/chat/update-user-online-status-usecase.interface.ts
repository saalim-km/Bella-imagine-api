import { TRole } from "../../../shared/constants";

export interface IUpdateUserOnlineStatusUsecase {
    execute(userId : string , userType : TRole , status : true | false): Promise<void>
}