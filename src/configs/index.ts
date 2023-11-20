import 'dotenv/config'
import {S3ClientConfig} from "@aws-sdk/client-s3"
export default class configClass {

  private static _instance: configClass;
  private constructor() {}

  public static initialize() {
    if (!this._instance) {
      this._instance = new configClass();
    }
    return this._instance;
  }

  get ServerInfo(){
    return {PORT: process.env.PORT}
  }

  get MongoConfigDetails(){
    return { mongo_uri: process.env.mongo_uri || '',mongo_db_name : process.env.mongo_db_name }
  }
  
  get ConfigDetails(){
    return {privateKey : process.env.privateKey || '', pubicKey : process.env.publicKey || ''}
  }

  get Salt(){
    return {salt:process.env.salt || ''}
  }

  get getS3Creditial():S3ClientConfig  {
    return {
      region: process.env.S3_REGION || 'ap-south-1',
      credentials: {
        accessKeyId: process.env.S3_IAM_USER_KEY || '',
        secretAccessKey: process.env.S3_IAM_USER_SECRET || '',
      },
    };
  }

  get S3BucketInfo(){
    return {region: process.env.Region,bucket: process.env.bucket || ''}
  }

 
}
