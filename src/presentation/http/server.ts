import express, { Application } from "express";
import http from "http";
import cors from 'cors'
import cookieparser from 'cookie-parser';
import rateLimit from "express-rate-limit";
import { config } from "../../interfaceAdapters/config/config";
import { AuthRoute } from "../routes/auth/auth-route";
import { PrivateRoute } from "../routes/common/private-route";
import { errorHandler } from "../middlewares/error-middleware";
import logger from "../../domain/shared/logger/logger";


export class Server {
  private _app: Application;
  private _server: http.Server;
  constructor() {
    this._app = express();
    this._server = http.createServer(this._app);

    this.configureMiddleware();
    // this.configureSocket();
    this.configureRoutes();
    this.configureErrorHandler();
  }

  private configureMiddleware(): void {
    this._app.use(
      cors({
        origin: config.cors.ALLOWED_ORIGIN,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Authorization", "Content-Type", "stripe-signature"],
        credentials: true,
      })
    );

    this._app.use(cookieparser());
    this._app.use((req, res, next) => {
      logger.info(`${req.method} ${req.url}`);
      next();
    });
    this._app.use(express.json());
    this._app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 1000,
      })
    );
  }

//   private configureSocket(): void {
//     chatController.initialize(this._server);
//   }

  private configureRoutes(): void {
    this._app.use("/api/v_1/auth", new AuthRoute().router);
    this._app.use("/api/v_1/_pvt", new PrivateRoute().router);
  }

  private configureErrorHandler(): void {
    this._app.use(errorHandler);
  }

  public getApp() {
    return this._app;
  }

  public getServer() {
    return this._server;
  }
}
