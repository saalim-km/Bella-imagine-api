import { ObjectId } from "mongoose";
import { TRole } from "../../../shared/constants/constants";
import { IUser } from "../../models/user-base";


export interface IEmailCheckResult<T> {
    success : boolean;
    data : T | null
}

export interface IEmailExistenceUsecase<T> {
    doesEmailExist(email : string , userRole : TRole) : Promise<IEmailCheckResult<T>>
}