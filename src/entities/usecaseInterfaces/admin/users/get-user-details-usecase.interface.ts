import { ObjectId } from "mongoose";
import { IClientEntity } from "../../models/client.entity";
import { IVendorEntity } from "../../models/vendor.entity";
import { TRole } from "../../../shared/constants";

export interface IGetUserDetailsUsecase {
    execute(userId : string | ObjectId , role : TRole) : Promise<IClientEntity | IVendorEntity >
}