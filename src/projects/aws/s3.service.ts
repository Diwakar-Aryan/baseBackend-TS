import { HttpResponse } from "../../interfaces/http.response";
import configClass from "../../configs";
import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
  
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { HttpStatus } from "../../shared/enums/http-status.enum";
import { HttpException } from "../../interfaces/http.exception";

export default class S3Service {
  config = configClass.initialize();
  public static instance: S3Service;
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client(this.config.getS3Creditial);
  }

  public static initialize() {
    if (!this.instance) {
      this.instance = new S3Service();
    }
    return this.instance;
  }

  public async listOjects() {
    try {
      const cpmmand = new ListObjectsV2Command({
        Bucket: this.config.S3BucketInfo.bucket,
      });
      let objects = await this.s3.send(cpmmand);
      console.log(objects);
    } catch (error) {
      console.error(error);
    }
  }

  public async getPresignedUrl(options: any) {
    try {
      const params: any = {
        Bucket: this.config.S3BucketInfo.bucket,
        Key: `${options.Key}`,
      };
      const command = new GetObjectCommand(params);
      const presignedUploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 3600 })
      return new HttpResponse(
        "Presigned Url Generated",
        presignedUploadUrl,
        HttpStatus.OK
      );
    } catch (error) {
      console.error(error);
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Error when fetching presignedUrl"
      );
    }
  }
  public async putPresignedUrl(options: any) {
    try {
      const params: any = {
        Bucket: this.config.S3BucketInfo.bucket,
        Key: `${options.Key}`,
        ContentType: options.contentType,
        // Metadata: options.Metadata,
      };
      const command = new PutObjectCommand(params);
      const presignedUploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 3600 })
      return new HttpResponse(
        "Presigned Url Generated",
        presignedUploadUrl,
        HttpStatus.OK
      );
    } catch (error) {
      console.error(error);
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Error when fetching presignedUrl"
      );
    }
  }
}
