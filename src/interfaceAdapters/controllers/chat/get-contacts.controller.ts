import { inject, injectable } from "tsyringe";
import { IGetContactsController } from "../../../entities/controllerInterfaces/chat/get-contacts-controller.interface";
import { IGetUserContactsUsecase } from "../../../entities/usecaseInterfaces/chat/get-user-contacts-usecase.interface";
import { Request, Response } from "express";
import { HTTP_STATUS, TRole } from "../../../shared/constants";

@injectable()
export class GetContactsController implements IGetContactsController {
    constructor(
        @inject('IGetUserContactsUsecase') private getContactsUsecase : IGetUserContactsUsecase
    ){}

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const {userId , userType} = req.params;
            console.log(userId , userType);
            const contacts = await this.getContactsUsecase.execute(userId , userType as TRole);
            res.status(HTTP_STATUS.OK).json(contacts);
        } catch (error) {
            console.log(error);
        }
    }
}