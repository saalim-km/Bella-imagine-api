import { Jwt, JwtPayload } from "jsonwebtoken";
import { TJwtPayload } from "../repository/types/auth.types";

export interface IJwtservice {
    generateAccessToken (data : TJwtPayload) : string
    generateRefreshToken (data : TJwtPayload) : string
    verifyAccessToken (token : string) : JwtPayload | null;
    verifyRefreshToken (token : string) : JwtPayload | null;
    decodeRefreshToken(token : string) : JwtPayload | null;
}