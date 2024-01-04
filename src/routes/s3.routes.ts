import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import S3Controller from "../controllers/s3.controller";

class s3Routes implements Routes {
    public path = '/s3'
    public router: Router = Router()
    public s3Controller = new S3Controller();
    constructor(){
        this.initializeRoutes()
    }

    private async initializeRoutes(){
        this.router.post(`${this.path}/putPresignedUrl`,this.s3Controller.putPresignedUrl)
        this.router.post(`${this.path}/getPresignedUrl`,this.s3Controller.getPresignedUrl)

    }

}

export default s3Routes