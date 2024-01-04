import { Request, Response, NextFunction } from "express";
import PaymentService from "./payment.service";
class FileController {
  paymentService = PaymentService.initialize();

  public doCheckout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const reqData = req.body;
      const response = await this.paymentService.checkout(reqData);
      // res.status(response.statusCode).json()
    } catch (error) {}
  };
}

export default FileController;
