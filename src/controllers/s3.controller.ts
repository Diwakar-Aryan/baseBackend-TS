import { Request, Response, NextFunction } from "express";
import S3Service from "../projects/aws/s3.service";

class S3Controller {
  s3Service = S3Service.initialize();
  public putPresignedUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      //get the code from qs
      const options = req.body;
      const response = await this.s3Service.putPresignedUrl(options);
      res
        .status(response.statusCode)
        .json({ data: response.data, message: response.message });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  public getPresignedUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log('hh');
      
      //get the code from qs
      const options = req.body;
      const response = await this.s3Service.getPresignedUrl(options);
      res
        .status(response.statusCode)
        .json({ data: response.data, message: response.message });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}

export default S3Controller;
