import { inject, injectable } from "tsyringe";
import { IGetUserDetailsStrategy } from "../../../domain/interfaces/usecase/admin-usecase.interface";
import { UserDetailsInput } from "../../../domain/interfaces/usecase/types/admin.types";
import { IClientRepository } from "../../../domain/interfaces/repository/client.repository";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants/constants";
import { CustomError } from "../../../shared/utils/helper/custom-error";
import { IGetPresignedUrlUsecase } from "../../../domain/interfaces/usecase/common-usecase.interfaces";
import { IClient } from "../../../domain/models/client";
import { Mapper } from "../../../shared/utils/mapper";

@injectable()
export class GetClientDetailsStrategy implements IGetUserDetailsStrategy<IClient> {
    constructor(
        @inject('IClientRepository') private _clientRepository : IClientRepository,
        @inject('IGetPresignedUrlUsecase') private _getSigned : IGetPresignedUrlUsecase
    ){

    }

    async getDetails(input: UserDetailsInput): Promise<Partial<IClient>> {
        const {id} = input;
        const client = await this._clientRepository.findById(id)
        if(!client){
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND , HTTP_STATUS.NOT_FOUND)
        }

        if(client.profileImage && !client.profileImage.includes('google')){
            client.profileImage = await this._getSigned.getPresignedUrl(client.profileImage)
        }
        
        return Mapper.clientMapper(client)
    }
}