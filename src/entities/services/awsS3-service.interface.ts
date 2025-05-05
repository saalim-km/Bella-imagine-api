import { S3Client } from "@aws-sdk/client-s3";

export interface IAwsS3Service {
    uploadFileToAws(key: string, filePath: string) : Promise<string>;
    getFileUrlFromAws(fileName : string , expireTime : number) : Promise<string>
    isFileAvailableInAwsBucket(fileName: string) : Promise<boolean>
    deleteFileFromAws (fileName: string) : Promise<void>
    isFileAvailableInAwsBucket (fileName : string) : Promise<boolean>
}