import { JwtPayload } from "jsonwebtoken";
import { TJwtPayload } from "../../shared/types/auth/jwt-payload.type";

export interface IJwtservice {
    generateAccessToken (data : TJwtPayload) : string
    generateRefreshToken (data : TJwtPayload) : string
    verifyAccessToken (token : string) : JwtPayload | null;
    verifyRefreshToken (token : string) : JwtPayload | null;
}