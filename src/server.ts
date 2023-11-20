import App from "./app";
import AuthRoutes from "./routes/auth.routes";
import s3Routes from "./routes/s3.routes";
import MongoClientClass from "./databases/mongo/setup";
import fileRoutes from "./routes/file.routes";

async function startServer() {
  try {
    await MongoClientClass.initialize().initializeMongoConnection();

    const app = new App([new AuthRoutes(),new s3Routes(),new fileRoutes()]);
    await app.listen();
  } catch (error) {
    console.log(`Errored out in server ${error}`);
  }
}
startServer();
