import { inject, injectable, injectWithTransform } from "tsyringe";
import { IDecoded, IRefreshTokenUsecase } from "../../entities/usecaseInterfaces/auth/refresh-token-usecase.interface";
import { JwtPayload } from "jsonwebtoken";
import { IJwtservice } from "../../entities/services/jwt.service";
import { CustomError } from "../../entities/utils/custom-error";
import { HTTP_STATUS, TRole } from "../../shared/constants";



@injectable()
export class RefreshTokenUsecase implements IRefreshTokenUsecase {
    constructor(
        @inject("IJwtservice") private jwtService : IJwtservice
    ){}
    execute(decoded : any ): string {
        const {_id , email , role , refreshToken} = decoded;

        const payload = this.jwtService.verifyRefreshToken(refreshToken);


        if(!payload) {
            throw new CustomError("Invalid refresh token" , HTTP_STATUS.BAD_REQUEST)
        }

        return this.jwtService.generateAccessToken({_id , email , role})
    }
}