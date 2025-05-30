import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "../../../domain/interfaces/repository/wallet-repository";
import { IClientRepository } from "../../../domain/interfaces/repository/client-repository";
import { RegisterUserInput } from "../auth.types";
import { CustomError } from "../../../shared/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants/constants";
import { IEmailExistenceUsecase } from "../../../domain/interfaces/usecase/common-usecase.interfaces";
import { IBcryptService } from "../../../domain/interfaces/service/bcrypt-service.interface";
import { IClient } from "../../../domain/models/client";
import { IRegisterUserStrategy } from "../../../domain/interfaces/usecase/auth-usecase.interfaces";

@injectable()
export class ClientRegisterStrategy implements IRegisterUserStrategy {
    constructor(
        @inject('IWalletRepository') private _walletRepository : IWalletRepository,
        @inject('IClientRepository') private _clientRepository : IClientRepository,
        @inject('IEmailExistenceUsecase') private _emailExistence : IEmailExistenceUsecase,
        @inject('IBcryptService') private _bcryptService : IBcryptService
    ){}

    async register(input: RegisterUserInput): Promise<void> {
        if(input.role !== 'client') {
            throw new CustomError(ERROR_MESSAGES.INVALID_ROLE,HTTP_STATUS.BAD_REQUEST)
        }

        const userExists = await this._emailExistence.doesEmailExist(input.email,input.role);
        if(userExists) {
            throw new CustomError(ERROR_MESSAGES.EMAIL_EXISTS, HTTP_STATUS.BAD_REQUEST)
        }

        const {name , email , password} = input;

        let hashedNewPassword = null;

        if(password){
            hashedNewPassword = await this._bcryptService.hash(password);
        }

        let data : Partial<IClient> = {};
        if(input.googleId){
            data.name = name;
            data.email = email;
            data.googleId = input.googleId;
        }else{
            if(!password){
                throw new CustomError(ERROR_MESSAGES.PASSWORD_REQUIRED,HTTP_STATUS.BAD_REQUEST)
            }
            data.name = name;
            data.email = email;
            data.password = hashedNewPassword!
        }

        const newClient = await this._clientRepository.saveUser(data);
        await this._walletRepository.createWallet({userId : newClient._id , userType : 'Client' , role : 'client' })
    }
}