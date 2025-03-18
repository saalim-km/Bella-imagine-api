import { inject, injectable } from "tsyringe";
import { IUpdateClientUsecase } from "../../entities/usecaseInterfaces/client/update-client-profile-usecase.interface";
import { UpdateClientDto } from "../../shared/dtos/user.dto";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client-repository.interface";
import { CustomError } from "../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class UpdateClientUsecase implements IUpdateClientUsecase {
    constructor(
        @inject("IClientRepository") private clientRepository : IClientRepository,
    ){}
    async excute(id : string , data: UpdateClientDto): Promise<void> {
        console.log('----------------------updateClientUseCase-----------------------------');

        const client = await this.clientRepository.findById(id);
        console.log('client data : ',client);
        if(!client) {
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND,HTTP_STATUS.BAD_REQUEST)
        }

        if (data?.name !== undefined) {
            client.name = data.name;
        }
        if (data?.phoneNumber !== undefined) {
            client.phoneNumber = data.phoneNumber;
        }
        if (data?.profileImage !== undefined) {
            client.profileImage = data.profileImage;
        }
        if (data?.location !== undefined) {
            client.location = data.location;
        }

        const result = await this.clientRepository.updateClientProfileById(id, client);
        console.log('updated client profile', result);
    }
}