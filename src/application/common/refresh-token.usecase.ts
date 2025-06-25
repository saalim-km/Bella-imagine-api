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
        console.log('usecase for creating the accesstoken' , decoded);
        const {_id , email , role , refreshToken} = decoded;

        try {
            const payload = this.jwtService.verifyRefreshToken(refreshToken);
            
            if(!payload) {
                throw new CustomError("Invalid refresh token" , HTTP_STATUS.UNAUTHORIZED)
            }

            console.log('refresh token verified : ',payload);
            return this.jwtService.generateAccessToken({_id , email , role})
        } catch (error) {
            console.error('Refresh token verification failed:', error);
            throw new CustomError("Refresh token expired or invalid" , HTTP_STATUS.UNAUTHORIZED)
        }
    }
}