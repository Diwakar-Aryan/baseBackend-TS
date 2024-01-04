import App from "./app";
import AuthRoutes from "./routes/auth.routes";
import s3Routes from "./routes/s3.routes";
import MongoClientClass from "./databases/mongo/setup";
import fileRoutes from "./routes/file.routes";
import PaymentRoute from "./routes/payment.routes";
import { Server } from "socket.io";
import { createServer } from "http";

async function startServer() {
  try {
    await MongoClientClass.initialize().initializeMongoConnection();

    const app = new App([
      new AuthRoutes(),
      new s3Routes(),
      new fileRoutes(),
      new PaymentRoute(),
    ]);
    await app.listen();
    const exApp = app.Server;
    const httpServer = createServer(exApp);

    const io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:4200",
      },
    });
    io.on("connection", (socket) => {
      console.log("Socket open ", socket.id);
    });

    io.on("message", (data) => {
      console.log("Socket open for messages ");
    });
    httpServer.listen(3001);
  } catch (error) {
    console.log(`Errored out in server ${error}`);
  }
}
startServer();
