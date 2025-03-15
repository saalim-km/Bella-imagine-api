import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../../entities/repositoryInterfaces/client/client-repository.interface";
import { ILoginStrategy } from "../interfaces/login-strategy.interface";
import { LoginUserDto } from "../../../shared/dtos/user.dto";
import { CustomError } from "../../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IBcrypt } from "../../../frameworks/security/bcrypt.interface";
import { IClientEntity } from "../../../entities/models/client.entity";

@injectable()
export class ClientLoginStrategy implements ILoginStrategy<IClientEntity> {
    constructor(
        @inject("IClientRepository") private clientRepository : IClientRepository,
        @inject("PasswordBcrypt") private passBcrypt : IBcrypt
    ){}

    async login(data: LoginUserDto): Promise<IClientEntity> {
        const client = await this.clientRepository.findByEmail(data.email);

        if(!client || !data.password || !client.password) {
            throw new CustomError(
                ERROR_MESSAGES.EMAIL_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        const isPassMatch = await this.passBcrypt.compare(data.password, client.password)

        if(!isPassMatch) {
            throw new CustomError(
                'Wrong Password',
                HTTP_STATUS.UNAUTHORIZED
            )
        }

        return client;
    }
}