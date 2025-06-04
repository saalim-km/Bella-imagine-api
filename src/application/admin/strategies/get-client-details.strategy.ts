import { inject, injectable } from "tsyringe";
import { IGetUserDetailsStrategy } from "../../../domain/interfaces/usecase/admin-usecase.interface";
import { UserDetailsInput } from "../../../domain/interfaces/usecase/types/admin.types";
import { IClientRepository } from "../../../domain/interfaces/repository/client-repository";
import { IUser } from "../../../domain/models/user-base";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants/constants";
import { CustomError } from "../../../shared/utils/custom-error";
import { IGetPresignedUrlUsecase } from "../../../domain/interfaces/usecase/common-usecase.interfaces";
import { IVendor } from "../../../domain/models/vendor";
import { IClient } from "../../../domain/models/client";

@injectable()
export class GetClientDetailsStrategy implements IGetUserDetailsStrategy {
    constructor(
        @inject('IClientRepository') private _clientRepository : IClientRepository,
        @inject('IGetPresignedUrlUsecase') private _getSigned : IGetPresignedUrlUsecase
    ){

    }

    async getDetails(input: UserDetailsInput): Promise<IClient> {
        const {id , role} = input;
        const client = await this._clientRepository.findById(id)
        if(!client){
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND , HTTP_STATUS.BAD_REQUEST)
        }

        if(client.profileImage){
            client.profileImage = await this._getSigned.getPresignedUrl(client.profileImage)
        }

        return client;
    }
}