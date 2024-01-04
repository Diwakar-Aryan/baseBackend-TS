import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import { Request, Response } from "express";
import AuthController from "../controllers/auth.controller";

class PaymentRoute implements Routes {
  public path = "/payments";

  public router: Router = Router();
  public authController = new AuthController();
  constructor() {
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    this.router.post(`${this.path}/checkout`, (req: Request, res: Response) => {
      console.log(req.body);
    });
  }
}

export default PaymentRoute;
