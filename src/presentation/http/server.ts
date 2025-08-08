import express, { Application } from "express";
import http from "http";
import cors from "cors";
import cookieparser from "cookie-parser";
import { config } from "../../shared/config/config";
import { AuthRoute } from "../routes/auth.routes";
import { PrivateRoute } from "../routes/private.route";
import { errorHandler } from "../middlewares/error.middleware";
import logger from "../../shared/logger/logger";
import { globalRateLimit } from "../middlewares/rate-limit.middleware";
import { socketService } from "../di/resolver";
import { ChatRoute } from "../routes/chat.route";

export class Server {
  private _app: Application;
  private _server: http.Server;
  constructor() {
    this._app = express();
    this._server = http.createServer(this._app);

    this.configureMiddleware();
    this.configureSocket();
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

    // Middleware to parse cookies
    this._app.use(cookieparser());

    this._app.use(express.json({ limit: "10mb" }));
    this._app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Middleware to log requests
    this._app.use((req, res, next) => {
      logger.info(`${req.method} ${req.url}`);
      next();
    });


    // Rate limiting
    this._app.use(globalRateLimit);
  }

  private configureSocket(): void {
    socketService.initialize(this._server);
  }

  private configureRoutes(): void {
    this._app.use("/api/v_1/auth", new AuthRoute().router);
    this._app.use("/api/v_1/_pvt", new PrivateRoute().router);
    this._app.use("/api/v_1/_chat", new ChatRoute().router);
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
