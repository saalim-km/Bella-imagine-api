import { S3Client } from "@aws-sdk/client-s3";

export interface IAwsS3Service {
    uploadFileToAws(fileName : string, filePath : string) : Promise<void>;
    getFileUrlFromAws(fileName : string , expireTime : number) : Promise<string>
    isFileAvailableInAwsBucket(fileName: string) : Promise<boolean>
    deleteFileFromAws (fileName: string) : Promise<void>
    isFileAvailableInAwsBucket (fileName : string) : Promise<boolean>
}