import { inject, injectable } from "tsyringe";
import { IGenerateTokenUsecase } from "../../entities/usecaseInterfaces/auth/generate-token-usecase.interface";
import { TJwtPayload } from "../../shared/types/auth/jwt-payload.type";
import { IJwtservice } from "../../entities/services/jwt.service";

@injectable()
export class GenerateTokenUsecase implements IGenerateTokenUsecase {
    constructor(
        @inject("IJwtservice") private jwtService : IJwtservice  
    ) {}
    async execute(data: TJwtPayload): Promise<{ accessToken: string; refreshToken: string; }> {
        const accessToken = await this.jwtService.generateAccessToken(data);
        const refreshToken = await this.jwtService.generateRefreshToken(data);  
        
        console.log(`token generated access: ${accessToken} \n
                refresh : ${refreshToken}
            `);
            
        return {
            accessToken,
            refreshToken
        }
    }
}