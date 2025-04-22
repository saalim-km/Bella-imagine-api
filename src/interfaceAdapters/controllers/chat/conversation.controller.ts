import { inject, injectable } from "tsyringe";
import { IConversationController } from "../../../entities/controllerInterfaces/chat/conversation-controller.interface";
import { IConversationUsecase } from "../../../entities/usecaseInterfaces/chat/conversation-usecase.interface";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom-error";
import { CreateConversationDTO } from "../../../entities/models/conversation.entity";
import { IConversationRepository } from "../../../entities/repositoryInterfaces/chat/conversation-repository";

@injectable()
export class ConversationController implements IConversationController {
  constructor(
    @inject("IConversationUsecase")
    private conversationUsecase: IConversationUsecase,
    @inject('IConversationRepository') private conversationRepository: IConversationRepository
  ) {}

  async createConversationController(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const dto: CreateConversationDTO = req.body;
      const conversation =
        await this.conversationUsecase.createConversationUsecase(dto);
      res.status(HTTP_STATUS.CREATED).json(conversation);
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

  async getUserConversationsController(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
        const {userId} = req.params;
        const conversations = await this.conversationRepository.findUserConversations(userId);
        res.status(HTTP_STATUS.OK).json(conversations);
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
