import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../../entities/repositoryInterfaces/client/client-repository.interface";
import { IRegisterStrategy } from "../interfaces/register-strategy.interface";
import { ClientDTO } from "../../../shared/dtos/user.dto";
import { CustomError } from "../../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IClientEntity } from "../../../entities/models/client.entity";
import { IBcrypt } from "../../../frameworks/security/bcrypt.interface";
import { IWalletRepository } from "../../../entities/repositoryInterfaces/wallet-repository.interface";

@injectable()
export class ClientRegisterStrategy implements IRegisterStrategy<IClientEntity> {
    constructor(
    @inject("IClientRepository") private clientRepository : IClientRepository,
    @inject("PasswordBcrypt") private passwordBcrypt : IBcrypt,
    @inject("IWalletRepository") private walletRepository : IWalletRepository
    ) {}


    async register(user : IClientEntity): Promise<IClientEntity> {
        console.log('in client register repository');
        if(user.role === 'client') {
            const existingClient = await this.clientRepository.findByEmail(user.email)

            if(existingClient) {
                throw new CustomError(
                    ERROR_MESSAGES.EMAIL_EXISTS,
                    HTTP_STATUS.CONFLICT
                )
            };

            const {name , email , password} = user as ClientDTO;

            let hashedPassword = null;

            if(password) {
                hashedPassword = await this.passwordBcrypt.hash(password);
            }

            let data;
            if(user.googleId) {
                data = await this.clientRepository.save({
                    name,
                    email,
                    googleId : user.googleId,
                    password: hashedPassword ?? "",
                    role: "client",
                    profileImage: user.profileImage || "", 
                    phoneNumber: 0, 
                    location: "", 
                    savedPhotographers: [],
                    savedPhotos: [],
                    isActive: true,
                    isblocked: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }else {
                data = await this.clientRepository.save({
                    name,
                    email,
                    password: hashedPassword ?? "",
                    role: "client",
                    profileImage: user.profileImage || "", 
                    phoneNumber: 0, 
                    location: "", 
                    savedPhotographers: [],
                    savedPhotos: [],
                    isActive: true,
                    isblocked: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }

            await this.walletRepository.create(data._id,'Client','client');
            return data;
        }else {
            throw new CustomError(
                "Invalid role for client registration",
                HTTP_STATUS.BAD_REQUEST
            )
        }
    }
}