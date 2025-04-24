import { inject, injectable } from "tsyringe";
import { IVendorEntity } from "../../entities/models/vendor.entity";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IGetVendorDetailsForChatUseCase } from "../../entities/usecaseInterfaces/chat/get-vendor-details.usecase";

@injectable()
export class GetVendorDetailsForChatUseCase
  implements IGetVendorDetailsForChatUseCase
{
  constructor(
    @inject("IVendorRepository") private vendorRepository: IVendorRepository
  ) {}

  async execute(vendorId: any): Promise<IVendorEntity | null> {
    return await this.vendorRepository.findByIdForChat(vendorId);
  }
}
