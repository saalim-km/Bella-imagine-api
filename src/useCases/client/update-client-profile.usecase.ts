import { inject, injectable } from "tsyringe";
import { IUpdateClientUsecase } from "../../entities/usecaseInterfaces/client/update-client-profile-usecase.interface";
import { UpdateClientDto } from "../../shared/dtos/user.dto";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client-repository.interface";

@injectable()
export class UpdateClientUsecase implements IUpdateClientUsecase {
    constructor(
        @inject("IClientRepository") private clientRepository : IClientRepository,
    ){}
    async excute(id : string , data: UpdateClientDto): Promise<void> {
        console.log('----------------------updateClientUseCase-----------------------------');
        console.log(id,data);
        const {name,email,profileImage,location,phoneNumber} = data;
        console.log(email);

        if (!name || !email || !profileImage || !location || !phoneNumber) {
            throw new Error('Data for updating is missing');
        }

        const client = await this.clientRepository.findByEmail(data.email);
        console.log('client data : ',client);
        if (!client) {
            throw new Error('Client not found');
        }

        client.name = name;
        client.profileImage = profileImage;
        client.location = location;
        client.phoneNumber = phoneNumber;

        const result = await this.clientRepository.updateClientProfileById(id , client);
        console.log('updated client profile',result);
    }
}