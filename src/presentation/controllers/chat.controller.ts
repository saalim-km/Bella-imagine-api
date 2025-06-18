import { inject, injectable } from "tsyringe";
import { IChatController } from "../../domain/interfaces/controller/chat-controller.interface";
import { IChatUsecase } from "../../domain/interfaces/usecase/chat-usecase.interface";
import { Request, Response } from "express";
import { uploadMediaChat } from "../../shared/utils/zod-validations/presentation/client.schema";
import { ResponseHandler } from "../../shared/utils/helper/response-handler";

@injectable()
export class ChatController implements IChatController {
    constructor(
        @inject('IChatUsecase') private _chatUsecase : IChatUsecase
    ){}

    async uploadMedia(req: Request, res: Response): Promise<void> {
        const parsed = uploadMediaChat.parse({media : req.file , conversationId : req.body.conversationId})
        console.log('parsed data : ',parsed);
        const media = await this._chatUsecase.uploadMedia(parsed)
        ResponseHandler.success(res,'Media UPload Sucess',media)
    }
}