import { inject, injectable } from "tsyringe";
import { BaseController } from "./base-controller";
import { Request, Response } from "express";
import { ISendAuthEmailUsecase } from "../../domain/interfaces/usecase/auth-usecase.interfaces";
import { RegisterInputDto, SendOtpEmailInputDto } from "../dto/auth-dto";
import { SUCCESS_MESSAGES } from "../../shared/constants/constants";
import { ResponseHandler } from "../../shared/utils/response-handler";
import { IAuthController } from "../../domain/interfaces/controller/auth-controller.interface";
import { userRegisterSchema } from "../../shared/utils/zod-validations/auth.schema";

@injectable()
export class AuthController implements IAuthController {
    constructor(
        @inject('ISendAuthEmailUsecase') private _sendAuthEmailUsecase : ISendAuthEmailUsecase
    ) {}
    async sendOtp(req: Request, res: Response) : Promise<void> {
        const { email, role } = req.body as SendOtpEmailInputDto;

        await this._sendAuthEmailUsecase.sendAuthEmail(email,role);
        ResponseHandler.success(res, SUCCESS_MESSAGES.OTP_SEND_SUCCESS)
    }

    async register(req: Request, res: Response): Promise<void> {
        const {role} = req.body as RegisterInputDto
        const schema = userRegisterSchema[role]
        const validatedData = schema.parse(req.body)

    }
}