import { inject, injectable } from "tsyringe";
import { IJwtservice } from "../../domain/interfaces/service/jwt-service.interface";
import { IRefreshTokenUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { HTTP_STATUS } from "../../shared/constants/constants";



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