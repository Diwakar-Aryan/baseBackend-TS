import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import FileController from "../projects/fileUpload/fileUpload.controller";

class fileRoutes implements Routes {
    public path = '/file'
    public router: Router = Router()
    public fileController = new FileController();
    constructor(){
        this.initializeRoutes()
    }

    private async initializeRoutes(){
        this.router.post(`${this.path}/uploaded`,this.fileController.postFile)
    }

}

export default fileRoutes