import { JwtPayload } from "jsonwebtoken";
import { TJwtPayload } from "../../types/auth.types";

export interface IJwtservice {
    generateAccessToken (data : TJwtPayload) : string
    generateRefreshToken (data : TJwtPayload) : string
    verifyAccessToken (token : string) : TJwtPayload | null;
    verifyRefreshToken (token : string) : TJwtPayload | null;
    decodeRefreshToken(token : string) : JwtPayload | null;
}