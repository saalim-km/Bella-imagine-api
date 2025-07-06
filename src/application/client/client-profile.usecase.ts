import { inject, injectable } from "tsyringe";
import { IClientProfileUsecase } from "../../domain/interfaces/usecase/client-usecase.interface";
import { UpdateClientProfileInput } from "../../domain/interfaces/usecase/types/client.types";
import { IClient } from "../../domain/models/client";
import { IClientRepository } from "../../domain/interfaces/repository/client.repository";
import { IGetPresignedUrlUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { IAwsS3Service } from "../../domain/interfaces/service/aws-service.interface";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";
import { UpdateQuery } from "mongoose";
import { config } from "../../shared/config/config";
import path from "path";
import { unlinkSync } from "fs";

@injectable()
export class ClientProfileUsecase implements IClientProfileUsecase {
  constructor(
    @inject("IClientRepository") private _clientRepository: IClientRepository,
    @inject("IAwsS3Service") private _awsService: IAwsS3Service,
    @inject("IGetPresignedUrlUsecase")
    private _presignedUrl: IGetPresignedUrlUsecase
  ) {}

  async updateClientProfile(input: UpdateClientProfileInput): Promise<IClient> {
    const { name, clientId , location, phoneNumber, profileImage } =
      input;
    const client = await this._clientRepository.findById(clientId);
    if (!client) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const dataToUpdate: UpdateQuery<IClient> = {
      name: name,
      phoneNumber: phoneNumber || '',
    };

    if (location && location !== undefined) {
      dataToUpdate.location = location;
      dataToUpdate.geoLocation = {
      type: "Point",
      coordinates: [location.lng, location.lat],
      };
    }

    if (profileImage) {
      const isFileExists = await this._awsService.isFileAvailableInAwsBucket(
        client.profileImage
      );
      if (isFileExists) {
        await this._awsService.deleteFileFromAws(client.profileImage);
      }

      const fileKey = `${config.s3.profile}/${
        client._id
      }/${Date.now()}${path.extname(profileImage.originalname)}`;

      await this._awsService.uploadFileToAws(fileKey, profileImage.path);
      unlinkSync(profileImage.path);
      client.profileImage = fileKey;
      dataToUpdate.profileImage = fileKey;
    }

    const updatedClient = await this._clientRepository.update(
      client._id,
      dataToUpdate
    );

    if (!updatedClient) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (updatedClient.profileImage) {
      updatedClient.profileImage = await this._presignedUrl.getPresignedUrl(
        updatedClient.profileImage
      );
    }

    console.log("updated client profile  : ", updatedClient);
    return updatedClient;
  }
}
