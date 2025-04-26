import { TRole } from "../../../shared/constants";
import { IClientEntity } from "../../models/client.entity";
import { IUserEntityForChat } from "../../models/iuser.entity";
import { IVendorEntity } from "../../models/vendor.entity";

export interface IGetUserContactsUsecase {
    execute(userId : string, userType: TRole) : Promise<IVendorEntity[] | IClientEntity[] | null>
}