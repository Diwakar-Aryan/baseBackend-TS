import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import { Request,Response } from "express";
import AuthController from "../controllers/auth.controller";

class AuthRoutes implements Routes {
    public path = ''
    public router: Router = Router()
    public authController = new AuthController();
    constructor(){
        this.initializeRoutes()
    }

    private async initializeRoutes(){
        this.router.get(`${this.path}/sessions/oauth/google`,this.authController.googleOauth)
        this.router.post(`${this.path}/signUp`,this.authController.signUp)
        this.router.post(`${this.path}/signIn`,this.authController.signIn)
    }

}

export default AuthRoutes