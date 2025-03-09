import { JwtPayload } from "jsonwebtoken";
import { TRole } from "../../../shared/constants";

export interface IDecoded {
    _id: string ; email : string ; role : string ; refreshToken : string
}

export interface IRefreshTokenUsecase {
    execute(decoded : IDecoded) : string;
}