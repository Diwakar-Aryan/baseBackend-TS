import { HttpResponse } from "../../interfaces/http.response";
import configClass from "../../configs";
import { HttpStatus } from "../../shared/enums/http-status.enum";
import { HttpException } from "../../interfaces/http.exception";
import { fileUploadType } from "./fileUpload.interfaceType";
import { MongoMethod } from "../../databases/mongo/method";
import { v4 as uuidv4 } from "uuid";

export default class FileService {
  config = configClass.initialize();
  public static instance: FileService;
  mongoMethods: MongoMethod;
  private constructor() {
    this.mongoMethods = MongoMethod.initialize();
  }

  public static initialize() {
    if (!this.instance) {
      this.instance = new FileService();
    }
    return this.instance;
  }

  public async postFiles(options: fileUploadType) {
    try {

      if (!options.project_id) {
        options.project_id =uuidv4()
        const projectInsertData = {
          project_id: options.project_id,
          created_at: new Date(),
          updated_at: new Date(),
        };
        await this.mongoMethods.insertOne('projects',projectInsertData)
      }
      let fileInsertData:any ={
        project_id: options.project_id,
        files:[],
      }
      for (let file of options.files) {
        fileInsertData.files.push({
            file_name:file.name,
            file_size: file.size,
            file_url: `http://fileUploadService.com/${options.project_id}/${file.name}`,
            created_at: new Date()
        })
      }
      await this.mongoMethods.insertOne('files',fileInsertData)

      return new HttpResponse(
        "File Posted",
        "",
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
