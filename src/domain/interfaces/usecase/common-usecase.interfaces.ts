import { TRole } from "../../../shared/constants/constants";
import { IDecoded, IEmailCheckResult, SendEmailInput } from "./types/common.types";

export interface IEmailExistenceUsecase<T> {
    doesEmailExist(email : string , userRole : TRole) : Promise<IEmailCheckResult<T>>
}

export interface IGetPresignedUrlUsecase {
    getPresignedUrl(objectKey : string , ttlSecond ?: number): Promise<string>
}

export interface IRefreshTokenUsecase {
    execute(decoded : IDecoded) : string;
}
