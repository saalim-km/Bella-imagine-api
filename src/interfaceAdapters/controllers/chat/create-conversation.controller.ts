import { inject, injectable } from "tsyringe";
import { ICreateConversationController } from "../../../entities/controllerInterfaces/chat/create-conversation-controller.interface";
import { ICreateConversationUseCase } from "../../../entities/usecaseInterfaces/chat/create-conversation-usecase.interface";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class CreateConversationController implements ICreateConversationController {
    constructor(
        @inject('ICreateConversationUseCase') private createConversationUsecase : ICreateConversationUseCase
    ){}

    async handle(req: Request, res: Response): Promise<void> {
        try {
            console.log(req.body);
            const {clientId , vendorId} = req.body;
            const chatRoom = await this.createConversationUsecase.execute(clientId,vendorId)
            console.log('chatroom created : ',chatRoom);
            res.status(HTTP_STATUS.OK).json(chatRoom)
        } catch (error) {
            console.log('error occured while creating chat room: ',error);
        }
    }
}