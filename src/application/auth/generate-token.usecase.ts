import { inject, injectable } from "tsyringe";
import { IGenerateTokenUsecase } from "../../domain/interfaces/usecase/auth-usecase.interfaces";
import { JwtOutput, TJwtPayload } from "../../domain/types/auth.types";
import { IJwtservice } from "../../domain/interfaces/service/jwt-service.interface";

@injectable()
export class GenerateTokenUsecase implements IGenerateTokenUsecase {
    constructor(
        @inject("IJwtservice") private jwtService : IJwtservice  
    ) {}
    async generateToken(input: TJwtPayload): Promise<JwtOutput> {
        const accessToken = await this.jwtService.generateAccessToken(input);
        const refreshToken = await this.jwtService.generateRefreshToken(input);  
        
        console.log(`token generated access : ${accessToken} \n
                refresh : ${refreshToken}
            `);
            
        return {
            accessToken,
            refreshToken
        }
    }
}