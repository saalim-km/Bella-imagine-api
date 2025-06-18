import { inject, injectable } from "tsyringe";
import { IServiceCommandUsecase } from "../../domain/interfaces/usecase/vendor-usecase.interface";
import { IServiceRepository } from "../../domain/interfaces/repository/service.repository";
import { IService } from "../../domain/models/service";
import { CustomError } from "../../shared/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";
import { IWorksampleRepository } from "../../domain/interfaces/repository/worksample.repository";
import { IWorkSample } from "../../domain/models/worksample";
import { CreateWorkSampleInput } from "../../domain/interfaces/usecase/types/vendor.types";
import { IAwsS3Service } from "../../domain/interfaces/service/aws-service.interface";
import { config } from "../../shared/config/config";
import { generateS3FileKey } from "../../shared/utils/s3FileKeyGenerator";
import { string } from "zod";
import { unlinkSync } from "fs";
import { Types } from "mongoose";

@injectable()
export class ServiceCommandUsecase implements IServiceCommandUsecase {
  constructor(
    @inject("IServiceRepository") private _serviceRepo: IServiceRepository,
    @inject("IWorksampleRepository")
    private _workSampleRepo: IWorksampleRepository,
    @inject("IAwsS3Service") private _awsS3Service: IAwsS3Service
  ) {}

  async createService(input: IService): Promise<void> {
    await this._serviceRepo.create(input);
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

    let fileKeys: string[] = [];

    try {
      await Promise.all(
        media.map((image) => {
          const fileKey = generateS3FileKey(
            config.s3.workSample,
            image.originalname
          );
          fileKeys.push(fileKey);
          return this._awsS3Service.uploadFileToAws(fileKey, image.path);
        })
      );

      await this._workSampleRepo.create({
        service,
        vendor,
        title,
        description,
        tags,
        media: fileKeys,
        isPublished,
      });
    } finally {
      // ✅ Always clean up even if upload or DB operation fails
      media.forEach((image) => {
        try {
          unlinkSync(image.path);
        } catch (err) {
          console.error(`Failed to delete file ${image.path}:`, err);
        }
      });
    }
  }

  async deleteWorkSmaple(workSampleId: Types.ObjectId): Promise<void> {
    const isWorkSampleExists = await this._workSampleRepo.findById(workSampleId);
    if(!isWorkSampleExists) {
      throw new CustomError(ERROR_MESSAGES.WORKSMAPLE_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
    }

    await Promise.all(
      isWorkSampleExists.media.map(async (image)=> {
        const isFileExists = await this._awsS3Service.isFileAvailableInAwsBucket(image);
        if(isFileExists){
          return this._awsS3Service.deleteFileFromAws(image)
        }
      })
    )

    await this._workSampleRepo.delete(workSampleId)
  }
}
