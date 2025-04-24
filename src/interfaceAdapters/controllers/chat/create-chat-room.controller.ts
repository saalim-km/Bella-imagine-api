import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { ICreateChatRoomController } from "../../../entities/controllerInterfaces/chat/create-chat-room-controller.interface";
import { ICreateChatRoomUseCase } from "../../../entities/usecaseInterfaces/chat/create-chat-room-usecase.interface";

@injectable()
export class CreateChatRoomController implements ICreateChatRoomController {
  constructor(
    @inject("ICreateChatRoomUseCase")
    private createChatRoomUseCase: ICreateChatRoomUseCase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { clientId, vendorId } = req.body;
      if (!clientId || !vendorId) {
        res.status(400).json({ error: "clientId and vendorId are required" });
        return;
      }
      const chatRoom = await this.createChatRoomUseCase.execute(clientId, vendorId);
      res.status(201).json(chatRoom);
    } catch (error) {
      console.error("Error creating chat room:", error);
      res.status(500).json({ error: "Failed to create chat room" });
    }
  }
}
