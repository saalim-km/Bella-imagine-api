import { TJwtPayload } from "../../../shared/types/auth/jwt-payload.type";

export interface IGenerateTokenUsecase {
    execute (data : TJwtPayload) : Promise<{accessToken : string , refreshToken : string}>
}