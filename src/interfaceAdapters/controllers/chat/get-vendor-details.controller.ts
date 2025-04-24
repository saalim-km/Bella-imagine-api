import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../shared/constants";
import { IGetVendorDetailsForChatUseCase } from "../../../entities/usecaseInterfaces/chat/get-vendor-details.usecase";
import { IGetVendorDetailsForChatController } from "../../../entities/controllerInterfaces/chat/get-vendor-details-for-chat";

@injectable()
export class GetVendorDetailsForChatController implements IGetVendorDetailsForChatController {
  constructor(
    @inject("IGetVendorDetailsForChatUseCase")
    private getVendorDetailsForChatUseCase: IGetVendorDetailsForChatUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { vendorId } = req.params;

      if (!vendorId) {
        res.status(400).json({ error: "Vendor ID is required" });
        return;
      }

      const vendor = await this.getVendorDetailsForChatUseCase.execute(
        vendorId
      );

      if (!vendor) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Vendor not found" });
        return;
      }

      res.status(200).json({
        _id: vendor._id,
        name : vendor.name,
        profileImage: vendor.profileImage,
        email: vendor.email,
      });
    } catch (error) {
      console.error("Error fetching vendor details:", error);
      res.status(500).json({ error: "Failed to fetch vendor details" });
    }
  }
}
