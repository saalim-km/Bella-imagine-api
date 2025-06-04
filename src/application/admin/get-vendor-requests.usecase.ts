import { inject, injectable } from "tsyringe";
import { IGetVendorRequestUsecase } from "../../domain/interfaces/usecase/admin-usecase.interface";
import { IVendorRepository } from "../../domain/interfaces/repository/vendor-repository";
import { VendorRequestFilterInput } from "../../domain/interfaces/usecase/types/admin.types";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";
import { IVendor } from "../../domain/models/vendor";
import { FilterQuery } from "mongoose";

@injectable()
export class GetVendorRequestUsecase implements IGetVendorRequestUsecase {
  constructor(
    @inject("IVendorRepository") private _vendorRepository: IVendorRepository
  ) {}

  async getVendorRequests(
    input: VendorRequestFilterInput
  ): Promise<PaginatedResponse<IVendor>> {
    let search: FilterQuery<IVendor> = { role: "vendor" };
    let sort: number = -1;
    const skip = (input.page - 1) * input.limit;

    console.log('limit number :',input.limit);
    if (input.createdAt) {
      sort = input.createdAt;
    }

    if (typeof input.search === "string" && input.search.trim() !== "") {
      search = {
        ...search,
        $or: [
          { name: { $regex: input.search.trim(), $options: "i" } },
          { email: { $regex: input.search.trim(), $options: "i" } },
        ],
      };
    }

    const [users , count] = await Promise.all([
        this._vendorRepository.find(search,skip,input.limit,sort),
        this._vendorRepository.count(search)
    ])

    return {
        data : users,
        total : count
    }
  }
}
