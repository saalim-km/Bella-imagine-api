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

        if(!client) {
            throw new CustomError(
                ERROR_MESSAGES.USER_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        if(client.isblocked) {
            throw new CustomError('Access denied: Your account has been blocked',HTTP_STATUS.BAD_REQUEST)
        }
        
        if(!data.password) {
            throw new CustomError('Password is required to login',HTTP_STATUS.BAD_REQUEST);
        }

        if(!client.password) {
            throw new CustomError('The email address you entered is already registered with Google. Please log in using Google, or use a different email to continue.',HTTP_STATUS.CONFLICT)
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