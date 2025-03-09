import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IClientRepository } from "../../../entities/repositoryInterfaces/client/client-repository.interface";
import { IClientEntity } from "../../../entities/models/client.entity";
import { LoginUserDto } from "../../../shared/dtos/user.dto";
import { ILoginStrategy } from "../interfaces/login-strategy.interface";

@injectable()
export class ClientGoogleLoginStrategy implements ILoginStrategy {
    constructor(
        @inject("IClientRepository") private clientRepository : IClientRepository
    ){}
    async login(data: any): Promise<IClientEntity> {
        const client = await this.clientRepository.findByEmail(data.email);

        if(client) {
            if(client.isblocked) {
                throw new CustomError(ERROR_MESSAGES.BLOCKED , HTTP_STATUS.FORBIDDEN)
            }
        }

        return client as IClientEntity;
    }
}