import { inject, injectable } from "tsyringe";
import { IUpdateVendorController } from "../../../entities/controllerInterfaces/vendor/update-vendor-profile-controller.interface";
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IUpdateVendorProfileUsecase } from "../../../entities/usecaseInterfaces/vendor/update-vendor-profile-usecase.interface";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";
import { IAwsS3Service } from "../../../entities/services/awsS3-service.interface";
import path from "path";
import { unlinkSync } from "fs";

@injectable()
export class UpdateVendorController implements IUpdateVendorController {
  constructor(
    @inject("IUpdateVendorProfileUsecase") 
    private updateVendorProfileUsecase: IUpdateVendorProfileUsecase,
    @inject('IAwsS3Service') private awsS3Service : IAwsS3Service
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    try {
      console.log('got the files bitch : ',req.files);
      console.log('data for update : ',req.body);
      const user = (req as CustomRequest).user;
      const updateData = { ...req.body };
      
      // Type the files object correctly
      const files = req.files as { 
        [fieldname: string]: Express.Multer.File[]
      };

      // Handle profile image upload if exists
      if (files.profileImage?.[0]) {
        const profileImage = files.profileImage[0];
        const s3Key = `profile-images/${user._id}/${Date.now()}${path.extname(profileImage.originalname)}`;
        
        await this.awsS3Service.uploadFileToAws(s3Key, profileImage.path);
        updateData.profileImage = s3Key;
        
        // Delete local file after upload
        unlinkSync(profileImage.path);
      }

      // Handle verification document upload if exists
      if (files.verificationDocument?.[0]) {
        const verificationDoc = files.verificationDocument[0];
        const s3Key = `vendor-documents/${user._id}/${Date.now()}${path.extname(verificationDoc.originalname)}`;
        
        await this.awsS3Service.uploadFileToAws(s3Key, verificationDoc.path);
        updateData.verificationDocument = s3Key;
        
        // Delete local file after upload
        unlinkSync(verificationDoc.path);
      }

      console.log('updated data after upoading to s3 : ',updateData);
      const vendor = await this.updateVendorProfileUsecase.execute(user._id, updateData);
      res.status(HTTP_STATUS.OK).json({success : true , message : SUCCESS_MESSAGES.UPDATE_SUCCESS,vendor : vendor})
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          message: err.message,
        }));
        console.log(errors);
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.VALIDATION_ERROR,
          errors,
        });
        return;
      }
      if (error instanceof CustomError) {
        console.log(error);
        res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
        return;
      }
      console.log(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
    }
  }
}
