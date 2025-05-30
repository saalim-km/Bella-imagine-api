import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IRegisterUserUsecase, ISendAuthEmailUsecase, IVerifyOtpUsecase } from "../../domain/interfaces/usecase/auth-usecase.interfaces";
import { RegisterInputDto, SendOtpEmailInputDto, VerifyRegisterationDto } from "../dto/auth-dto";
import { SUCCESS_MESSAGES } from "../../shared/constants/constants";
import { ResponseHandler } from "../../shared/utils/response-handler";
import { IAuthController } from "../../domain/interfaces/controller/auth-controller.interface";
import { userRegisterSchema, verifyRegisterationSchema } from "../../shared/utils/zod-validations/auth.schema";

@injectable()
export class AuthController implements IAuthController {
    constructor(
        @inject('ISendAuthEmailUsecase') private _sendAuthEmailUsecase : ISendAuthEmailUsecase,
        @inject('IRegisterUserUsecase') private _registerUserUsecase : IRegisterUserUsecase,
        @inject('IVerifyOtpUsecase') private _verifyotpUsecase : IVerifyOtpUsecase
    ) {}

    async sendOtp(req: Request, res: Response) : Promise<void> {
        const { email, role } = req.body as SendOtpEmailInputDto;

        await this._sendAuthEmailUsecase.sendAuthEmail({email : email , userRole : role});
        ResponseHandler.success(res, SUCCESS_MESSAGES.OTP_SEND_SUCCESS)
    }

    async register(req: Request, res: Response): Promise<void> {
        const {role} = req.body as RegisterInputDto
        const schema = userRegisterSchema[role]
        const validatedData = schema.parse(req.body)

        await this._registerUserUsecase.register(validatedData)
        ResponseHandler.success(res,SUCCESS_MESSAGES.CREATED,null,201)
    }

    async verifyOtp(req: Request, res: Response): Promise<void> {
        const payload = req.body as VerifyRegisterationDto;
        const validatedData = verifyRegisterationSchema.parse(payload)
        
        await this._verifyotpUsecase.verifyOtp(validatedData)
        ResponseHandler.success(res,SUCCESS_MESSAGES.OTP_VERIFY_SUCCESS)
    }
}