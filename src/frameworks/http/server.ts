import express , { Application } from "express";
import cors from 'cors'
import morgan from 'morgan'
import { config } from "../../shared/config";
import cookieparser from 'cookie-parser';
import rateLimit from "express-rate-limit";
import { AuthRoute } from "../routes/auth/auth.route";
import { errorHandler } from "../../interfaceAdapters/middlewares/error.middleware";
import { PrivateRoute } from "../routes/common/private.route";

export class Server {
    private _app : Application;
    constructor() {
        this._app = express()
        
        this.configureMiddleware();
        this.configureRoutes()
        this.configureErrorHandler();
    }

    private configureMiddleware() : void {
        this._app.use(
            cors({
                origin : config.cors.ALLOWED_ORIGIN,
                methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
                allowedHeaders: ["Authorization", "Content-Type", "stripe-signature"],
                credentials: true,
            })
        );

        this._app.use(cookieparser());
        this._app.use(morgan('tiny'))
        this._app.use(express.json())
        this._app.use(
            rateLimit({
                windowMs: 15 * 60 * 1000,
                max: 1000,
            })
        )
        
    }

    private configureRoutes() : void {
        this._app.use("/api/v_1/auth" , new AuthRoute().router)
        this._app.use("/api/v_1/_pvt" , new PrivateRoute().router)
    }

    private configureErrorHandler() : void {
        this._app.use(errorHandler)
    }

    public getApp() {
        return this._app;
    }
}