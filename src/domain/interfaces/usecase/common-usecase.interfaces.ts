import { TRole } from "../../../shared/constants/constants";
import { IUser } from "../../models/user-base";
import { IDecoded, IEmailCheckResult } from "./types/common.types";

export interface IEmailExistenceUsecase<T = IUser> {
    doesEmailExist(email : string , userRole : TRole) : Promise<IEmailCheckResult<T>>
}

export interface IGetPresignedUrlUsecase {
    getPresignedUrl(objectKey : string , ttlSecond ?: number): Promise<string>
}

export interface IRefreshTokenUsecase {
    execute(decoded : IDecoded) : string;
}