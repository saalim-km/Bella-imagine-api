import { injectable } from "tsyringe";
import { IGenerateTokenUsecase } from "../../entities/usecaseIntefaces/auth/generate-token-usecase.interface";
import { TJwtPayload } from "../../shared/types/auth/jwt-payload.type";

@injectable()
export class GenerateTokenUsecase implements IGenerateTokenUsecase {
    async execute(data: TJwtPayload): Promise<{ accessToken: string; refreshToken: string; }> {
        
    }
}