import { Request, Response, NextFunction } from "express";
import {fileUploadType} from './fileUpload.interfaceType'
import FileService from "./fileUpload.service";
class FileController {
   fileService =  FileService.initialize()
  public postFile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const options: fileUploadType = req.body;
      const response = await this.fileService.postFiles(options);
      res
        .status(response.statusCode)
        .json({ data: response.data, message: response.message });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}

export default FileController;
