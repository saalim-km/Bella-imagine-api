import { injectable } from "tsyringe";
import { BaseUserRepository } from "./base-user-repository.mongo";
import { IVendor } from "../../domain/models/vendor";
import { Vendor } from "../database/schemas/vendor.schema";
import { IVendorRepository } from "../../domain/interfaces/repository/vendor.repository";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";
import { GetUsersInput } from "../../domain/types/admin.type";
import { FilterQuery } from "mongoose";

@injectable()
export class VendorRepository
  extends BaseUserRepository<IVendor>
  implements IVendorRepository
{
  constructor() {
    super(Vendor);
  }

  async findAllVendors(
    input: GetUsersInput
  ): Promise<PaginatedResponse<IVendor>> {
    const { filter, limit, skip, sort } = input;
    let query: FilterQuery<IVendor> = {};
    if (filter.isblocked) {
      query.isblocked = filter.isblocked;
    }
    query = {
      ...query,
      $or: [
        { name: { $regex: filter.name || "", $options: "i" } },
        { email: { $regex: filter.email || "", $options: "i" } },
      ],
    };

    console.log(query);
    const [vendors, count] = await Promise.all([
      this.findAll(query, skip, limit, sort),
      this.count(query),
    ]);
    console.log(vendors);
    return {
      data: vendors,
      total: count,
    };
  }
}
