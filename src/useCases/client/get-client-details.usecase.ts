import { inject, injectable } from "tsyringe";
import { IGetClientDetailsUsecase } from "../../entities/usecaseInterfaces/client/get-client-details-usecase.interface";
import { IClientEntity } from "../../entities/models/client.entity";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client-repository.interface";
import { IAwsS3Service } from "../../entities/services/awsS3-service.interface";

@injectable()
export class GetClientDetailsUsecase implements IGetClientDetailsUsecase {
    constructor(
        @inject("IClientRepository") private clientRepository : IClientRepository,
        @inject('IAwsS3Service') private awsS3Service : IAwsS3Service
    ){}
    async execute(id: any): Promise<IClientEntity | null> {
        if(!id) {
            throw new Error('id is required');
        }

        const data = await this.clientRepository.findById(id)
        if(data?.profileImage) {
            const isFileAvailable = await this.awsS3Service.isFileAvailableInAwsBucket(data.profileImage)
            if(isFileAvailable) {
                data.profileImage = await this.awsS3Service.getFileUrlFromAws(data.profileImage , 604800)
            }
        }

        console.log('in the GetClientDetailsUsecase : ',data);

        return data;
    }
}