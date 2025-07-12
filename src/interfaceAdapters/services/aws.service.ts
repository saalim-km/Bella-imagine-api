import { injectable } from "tsyringe";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { createReadStream } from "fs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import path from "path";
import { config } from "../../shared/config/config";
import { IAwsS3Service } from "../../domain/interfaces/service/aws-service.interface";

@injectable()
export class AwsS3Service implements IAwsS3Service {
  private s3Client: S3Client;
  constructor() {
    this.s3Client = new S3Client({
      region: config.s3.AWS_REGION,
      credentials: {
        accessKeyId: config.s3.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.s3.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFileToAws(key: string, filePath: string): Promise<string> {
    const fileStream = createReadStream(filePath);
    const contentType = this.getContentType(key);

    const uploadParams = {
      Bucket: config.s3.AWS_BUCKET_NAME,
      Key: key,
      Body: fileStream,
      ContentType: contentType,
    };

    try {
      await this.s3Client.send(new PutObjectCommand(uploadParams));
      return key;
    } catch (error) {
      console.error("S3 upload error:", error);
      throw new Error("Failed to upload file to S3");
    }
  }

  async getFileUrlFromAws(
    fileName: string,
    expireTime: number
  ): Promise<string> {
    const check = await this.isFileAvailableInAwsBucket(fileName);

    if (check) {
      const command = new GetObjectCommand({
        Bucket: config.s3.AWS_BUCKET_NAME,
        Key: fileName,
      });

      if (expireTime !== null) {
        const url = await getSignedUrl(this.s3Client, command, {
          expiresIn: expireTime,
        });
        return url;
      } else {
        const url = await getSignedUrl(this.s3Client, command);
        return url;
      }
    } else {
      return "";
    }
  }

  async isFileAvailableInAwsBucket(fileName: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: config.s3.AWS_BUCKET_NAME,
          Key: fileName,
        })
      );

      return true;
    } catch (error) {
      if (error instanceof Error && error.name === "NotFound") {
        return false;
      } else {
        return false;
      }
    }
  }

  async deleteFileFromAws(fileName: string): Promise<void> {
    const uploadParams = {
      Bucket: config.s3.AWS_BUCKET_NAME,
      Key: fileName,
    };

    await this.s3Client.send(new DeleteObjectCommand(uploadParams))
  }

  private getContentType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
      case '.jpg': case '.jpeg': return 'image/jpeg';
      case '.png': return 'image/png';
      case '.webp': return 'image/webp';
      default: return 'application/octet-stream';
    }
  }

  getPublicFileUrl(fileKey: string): string {
    return `https://${config.s3.AWS_BUCKET_NAME}.s3.${config.s3.AWS_REGION}.amazonaws.com/${fileKey}`;
  }  
}
