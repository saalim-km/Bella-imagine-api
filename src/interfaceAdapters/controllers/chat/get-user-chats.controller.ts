import { inject, injectable } from "tsyringe";
import { IGetUserConversationsController } from "../../../entities/controllerInterfaces/chat/get-user-chats-controller.interface";
import { IGetConversationsUsecase } from "../../../entities/usecaseInterfaces/chat/get-conversations-usecase.interface";
import { Request, Response } from "express";
import { HTTP_STATUS, TRole } from "../../../shared/constants";

@injectable()
export class GetUserChatsController implements IGetUserConversationsController {
    constructor(
        @inject('IGetConversationsUsecase') private getUserConversationUsecase : IGetConversationsUsecase
    ){}

    async handle(req: Request, res: Response): Promise<void> {
        try {
            console.log(req.params);
            const {userId , userType} = req.params;
            const conversations = await this.getUserConversationUsecase.execute(userId as string,userType as TRole)
            res.status(HTTP_STATUS.OK).json(conversations)
        } catch (error) {
            console.log('an error occured while fetching user chats : ',error);
        }
    }
}