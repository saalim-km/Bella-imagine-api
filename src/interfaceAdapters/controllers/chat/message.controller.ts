import { inject, injectable } from "tsyringe";
import { IMessageController } from "../../../entities/controllerInterfaces/chat/message-controller.interface";
import { IMessageUsecase } from "../../../entities/usecaseInterfaces/chat/message-usecase.interface";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";

@injectable()
export class MessageController implements IMessageController {
  constructor(
    @inject("IMessageUsecase") private messageUsecase: IMessageUsecase
  ) {}

  async getMessagesController(req: Request, res: Response): Promise<void> {
    try {
        const { page = 1, limit = 10 } = req.query;
        const conversationId = req.params.conversationId;
    
        const pageNumber = Number(page);
        const pageSize = Number(limit);

    
        const data = await this.messageUsecase.getMessagesUsecase(
            conversationId,
            pageNumber,
            pageSize,
        );
    
        res.status(HTTP_STATUS.OK).json(data);
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          message: err.message,
        }));
        console.log(errors);
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.VALIDATION_ERROR,
          errors,
        });
        return;
      }
      if (error instanceof CustomError) {
        console.log(error);
        res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
        return;
      }
      console.log(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
    }
  }
}
