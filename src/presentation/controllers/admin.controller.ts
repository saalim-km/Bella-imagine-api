import { injectable } from "tsyringe";
import { IAdminController } from "../../domain/interfaces/controller/admin-controller.interface";
import { Request, Response } from "express";
import { CustomRequest } from "../middlewares/auth.middleware";
import { clearAuthCookies } from "../../shared/utils/cookie-helper";
import { ResponseHandler } from "../../shared/utils/response-handler";
import { SUCCESS_MESSAGES } from "../../shared/constants/constants";

@injectable()
export class AdminController implements IAdminController {
    constructor(){}

    async logout(req: Request, res: Response): Promise<void> {
        const user =  (req as CustomRequest).user;
        console.log(user);
        const accessTokenName = `${user.role}_access_token`;
        const refreshTokenName = `${user.role}_refresh_token`;

        clearAuthCookies(res,accessTokenName,refreshTokenName);
        ResponseHandler.success(res , SUCCESS_MESSAGES.LOGOUT_SUCCESS)
    }
}