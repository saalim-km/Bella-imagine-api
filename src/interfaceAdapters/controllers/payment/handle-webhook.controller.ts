import { Request, Response } from "express";
import { IHandleWebHookController } from "../../../entities/controllerInterfaces/payment/handle-webhook-controller.interface";
import { HTTP_STATUS } from "../../../shared/constants";
import { IWebHookUseCase } from "../../../entities/usecaseInterfaces/payment/handle-webhook-usecase.interafec";
import { inject, injectable } from "tsyringe";

@injectable()
export class HandleWebHookController implements IHandleWebHookController {
  constructor(
    @inject("IWebHookUseCase") private webHookUseCase: IWebHookUseCase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    const sig = req.headers["stripe-signature"];
    if (!sig || typeof sig !== "string") {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ success: false, message: "Missing Stripe signature" });
      return;
    }

    await this.webHookUseCase.execute(sig, req.body);

    res.status(HTTP_STATUS.OK).json({ received: true });
  }
}