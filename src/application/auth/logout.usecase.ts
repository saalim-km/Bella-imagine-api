import { inject, injectable } from "tsyringe";
import { HTTP_STATUS } from "../../shared/constants/constants";
import { CustomError } from "../../shared/utils/helper/custom-error";
import logger from "../../shared/logger/logger";
import { IRedisService } from "../../domain/interfaces/service/redis-service.interface";
import { IJwtservice } from "../../domain/interfaces/service/jwt-service.interface";    
import { TJwtPayload } from "../../domain/types/auth.types";


@injectable()
export class LogoutUseCase {
    constructor(
        @inject('IRedisService') private _redisService: IRedisService,
        @inject('IJwtservice') private _jwtService: IJwtservice,
    ){}

    async logout(accessToken: string, refreshToken: string): Promise<void> {
        let userId: string;
        try {
            const decoded : TJwtPayload | null = this._jwtService.verifyAccessToken(accessToken);
            if (!decoded || !decoded) {
                throw new CustomError('User id is missing in accessToken', HTTP_STATUS.BAD_REQUEST);
            }
            userId = decoded._id;
        } catch (error) {
            logger.error(`error in logout: ${error}`);
            const decoded = this._jwtService.verifyRefreshToken(refreshToken)
            if (!decoded || !decoded._id) {
                throw new CustomError('User id is missing in refreshToken', HTTP_STATUS.BAD_REQUEST);
            }
            userId = decoded._id;
        }

        const expiryTime = 15 * 60 * 1000;
        await this._redisService.blacklistAccessToken(accessToken, expiryTime / 1000);
    }
}