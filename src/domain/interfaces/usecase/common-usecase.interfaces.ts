import { ObjectId } from "mongoose";
import { TRole } from "../../../shared/constants/constants";


export interface IEmailExistenceUsecase {
    doesEmailExist(email : string , userRole : TRole) : Promise<boolean>
}