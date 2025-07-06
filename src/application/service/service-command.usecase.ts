import { inject, injectable } from "tsyringe";
import { IServiceCommandUsecase } from "../../domain/interfaces/usecase/vendor-usecase.interface";
import { IServiceRepository } from "../../domain/interfaces/repository/service.repository";
import { IService } from "../../domain/models/service";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";
import { IWorksampleRepository } from "../../domain/interfaces/repository/worksample.repository";
import {
  CreateWorkSampleInput,
  UpdateWorkSampleInput,
} from "../../domain/interfaces/usecase/types/vendor.types";
import { IAwsS3Service } from "../../domain/interfaces/service/aws-service.interface";
import { config } from "../../shared/config/config";
import { generateS3FileKey } from "../../shared/utils/helper/s3FileKeyGenerator";
import { Types } from "mongoose";
import logger from "../../shared/logger/logger";
import { cleanUpLocalFiles } from "../../shared/utils/helper/clean-local-file.helper";
import { IVendorRepository } from "../../domain/interfaces/repository/vendor.repository";
import { GeoLocation } from "../../domain/models/user-base";

@injectable()
export class ServiceCommandUsecase implements IServiceCommandUsecase {
  constructor(
    @inject("IServiceRepository") private _serviceRepo: IServiceRepository,
    @inject("IWorksampleRepository")
    private _workSampleRepo: IWorksampleRepository,
    @inject("IAwsS3Service") private _awsS3Service: IAwsS3Service,
    @inject('IVendorRepository') private _vendorRepo : IVendorRepository
  ) {}

  async createService(input: IService): Promise<void> {
    const {vendor,location} = input;
    if(!vendor){
      throw new CustomError(ERROR_MESSAGES.ID_NOT_PROVIDED,HTTP_STATUS.BAD_REQUEST)
    }

    const geolocation : GeoLocation = {
      type : 'Point',
      coordinates : [location.lng,location.lat]
    }

    const service = await this._serviceRepo.create({...input,geoLocation : geolocation});
    await this._vendorRepo.update(vendor,{$push : {services : service._id}})
  }

  async updateService(input: IService): Promise<void> {
    if (!input._id) {
      throw new CustomError(
        ERROR_MESSAGES.ID_NOT_PROVIDED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const updatedService = await this._serviceRepo.update(input._id, input);
    if (!updatedService) {
      throw new CustomError(
        ERROR_MESSAGES.SERVICE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
  }

  async createWorkSample(input: CreateWorkSampleInput): Promise<void> {
    const { media, service, title, vendor, description, tags, isPublished } =
      input;
    let filekeys: string[] = [];
    const uploadedkeys: string[] = [];

    try {
      filekeys = media.map((image) =>
        generateS3FileKey(config.s3.workSample, image.originalname)
      );

      const uploadPromises = media.map(async (image, indx) => {
        const fileKey = filekeys[indx];
        try {
          await this._awsS3Service.uploadFileToAws(fileKey, image.path);
          uploadedkeys.push(fileKey);
        } catch (error) {
          console.error(`Failed to upload ${image.originalname}:`, error);
          throw error;
        }
      });

      await Promise.all(uploadPromises);

      const workSample = await this._workSampleRepo.create({
        service,
        vendor,
        title,
        description,
        tags,
        media: filekeys,
        isPublished,
      });
      await this._vendorRepo.update(vendor,{$push : {workSamples : workSample._id}})
    } catch (error) {
      if (uploadedkeys.length > 0) {
        logger.info(
          `Cleaning up ${uploadedkeys.length} uploaded files from S3`
        );
        await Promise.allSettled(
          uploadedkeys.map((key) => {
            return this._awsS3Service
              .deleteFileFromAws(key)
              .catch((err) => console.log(err));
          })
        );
      }

      throw error;
    } finally {
      await cleanUpLocalFiles(media);
    }
  }

  async deleteWorkSmaple(workSampleId: Types.ObjectId): Promise<void> {
    const isWorkSampleExists = await this._workSampleRepo.findById(
      workSampleId
    );
    if (!isWorkSampleExists) {
      throw new CustomError(
        ERROR_MESSAGES.WORKSMAPLE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    await Promise.all(
      isWorkSampleExists.media.map(async (image) => {
        const isFileExists =
          await this._awsS3Service.isFileAvailableInAwsBucket(image);
        if (isFileExists) {
          return this._awsS3Service.deleteFileFromAws(image);
        }
      })
    );

    await this._workSampleRepo.delete(workSampleId);
  }

  async updateWorkSample(input: UpdateWorkSampleInput): Promise<void> {
    const {
      _id,
      description,
      isPublished,
      service,
      tags,
      title,
      vendor,
      deletedImageKeys,
      existingImageKeys,
      newImages,
    } = input;

    console.log(vendor);

    const uploadedKeys: string[] = [];
    const fileKeys: string[] = existingImageKeys || [];

    try {
      if (deletedImageKeys && deletedImageKeys.length > 0) {
        const deletedPromises = deletedImageKeys.map(async (key) => {
          if (await this._awsS3Service.isFileAvailableInAwsBucket(key)) {
            return await this._awsS3Service.deleteFileFromAws(key);
          }
        });

        await Promise.all(deletedPromises);
      }

      if (newImages && newImages.length > 0) {
        const uploadPromises = newImages.map(async (image) => {
          const filekey = generateS3FileKey(config.s3.workSample, image.path);
          await this._awsS3Service.uploadFileToAws(filekey, image.path);
          uploadedKeys.push(filekey);
          fileKeys.push(filekey);
        });

        await Promise.all(uploadPromises);
      }

      await this._workSampleRepo.update(_id, {
        title: title,
        description: description,
        tags: tags,
        media: fileKeys,
        isPublished: isPublished,
        service : service,
      });
    } catch (error) {
      if (uploadedKeys && uploadedKeys.length > 0) {
        await Promise.allSettled(
          uploadedKeys.map((key) => {
            return this._awsS3Service
              .deleteFileFromAws(key)
              .catch((err) => console.log("failed to clean up s3 file", err));
          })
        );
      }
      console.log(error);
    } finally {
      if (newImages && newImages.length > 0) {
        await cleanUpLocalFiles(newImages);
      }
    }
  }

  async deleteService(serviceId: Types.ObjectId): Promise<void> {
    const service = await this._serviceRepo.findById(serviceId);
    if(!service) {
      throw new CustomError(ERROR_MESSAGES.SERVICE_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
    }

    const isWorkSamplesLinked = await this._workSampleRepo.findOne({service : serviceId});
    if(isWorkSamplesLinked) {
      throw new CustomError(ERROR_MESSAGES.WORKSMAPLE_LINKED , HTTP_STATUS.BAD_REQUEST)
    }

    await this._serviceRepo.delete(serviceId)
  }
}
