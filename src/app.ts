import express from "express";
import bodyParser from "body-parser";
import { Routes } from "./interfaces/routes.interface";
import configClass from "./configs";
import { errorMiddleware } from "./middlewares/error.middleware";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

class App {
  private app: express.Application;
  private config = configClass.initialize();

  constructor(routes: Routes[]) {
    this.app = express();
    this.initializeMiddlewares();
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.initializeRoutes(routes, "/api/");
    this.initializeErrorHandling();
  }

  public async listen() {
    this.app.listen(this.config.ServerInfo.PORT, () => {
      console.log(`App listening on port ${this.config.ServerInfo.PORT}`);
    });
  }

  public get Server() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(routes: Routes[], basePath: string) {
    routes.forEach((route) => {
      this.app.use(basePath, route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
