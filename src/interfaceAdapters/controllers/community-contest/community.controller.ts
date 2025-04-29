import { inject, injectable } from "tsyringe";
import { ICommunityController } from "../../../entities/controllerInterfaces/community-contest/community-controller.interface";
import { ICreateCommunityUsecase } from "../../../entities/usecaseInterfaces/community-contest/community/create-community-usecase.interface";
import { Request, Response } from "express";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants";

@injectable()
export class CommunityController implements ICommunityController {
    constructor(
        @inject('ICreateCommunityUsecase') private createCommunityUsecase : ICreateCommunityUsecase
    ){}

    async createCommunity(req: Request, res: Response): Promise<void> {
        try {
            console.log(req.body);
            await this.createCommunityUsecase.execute(req.body);
            res.status(HTTP_STATUS.CREATED).json({success: true , message : SUCCESS_MESSAGES.CREATED})
        } catch (error) {
            console.log(error);
        }
    }
}