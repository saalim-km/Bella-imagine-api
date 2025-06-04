import { TRole } from "../../../shared/constants/constants";

export interface IEmailCheckResult<T> {
    success : boolean;
    data : T | null
}
export interface IDecoded {
    _id: string ; email : string ; role : string ; refreshToken : string
}

export interface IEmailExistenceUsecase<T> {
    doesEmailExist(email : string , userRole : TRole) : Promise<IEmailCheckResult<T>>
}

export interface IGetPresignedUrlUsecase {
    getPresignedUrl(objectKey : string , ttlSecond ?: number): Promise<string>
}

export interface IRefreshTokenUsecase {
    execute(decoded : IDecoded) : string;
}