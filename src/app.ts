import express from 'express'
import bodyParser from 'body-parser';
import { Routes } from './interfaces/routes.interface';
import configClass from './configs';


class App {
    private app: express.Application
    private config = configClass.initialize()
    constructor(routes: Routes[]){
        
        this.app = express()
        this.app.use(bodyParser.json())
        this.initializeRoutes(routes,'/api/')

    }
    
    public async listen(){
        this.app.listen(this.config.ServerInfo.PORT,()=>{
            console.log(`App listening on port ${this.config.ServerInfo.PORT}`)
        })
    }

    public get Server() {
        return this.app;
    }

    private initializeRoutes(routes: Routes[],basePath:string){
        routes.forEach((route)=>{
            this.app.use(basePath,route.router)
        })
    }

}

export default App;