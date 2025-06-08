import { inject, injectable } from "tsyringe";
import {
  IGetUsersStrategy,
  IGetUsersUsecase,
} from "../../domain/interfaces/usecase/admin-usecase.interface";
import { UsersFilterInput } from "../../domain/interfaces/usecase/types/admin.types";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";
import { CustomError } from "../../shared/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";
import { IUser } from "../../domain/models/user-base";
import { FilterQuery } from "mongoose";
import { IClient } from "../../domain/models/client";
import { IVendor } from "../../domain/models/vendor";

@injectable()
export class GetUsersUsecase implements IGetUsersUsecase {
  private _strategies: Record<string, IGetUsersStrategy<IUser>>;
  constructor(
    @inject("GetClientsStrategy") private _clientStrategy: IGetUsersStrategy<IClient>,
    @inject("GetVendorsStrategy") private _vendorStrategy: IGetUsersStrategy<IVendor>
  ) {
    this._strategies = {
      client: this._clientStrategy,
      vendor: this._vendorStrategy,
    };
  }
  async getUsers(input: UsersFilterInput): Promise<PaginatedResponse<IUser>> {
    const strategy = await this._strategies[input.role];
    if (!strategy) {
      throw new CustomError(
        ERROR_MESSAGES.INVALID_ROLE,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    let search: FilterQuery<IUser> = {};

    if (input) {
      if (input.isblocked !== undefined) {
        search.isblocked = input.isblocked;
      }

      if (typeof input.search === "string" && input.search !== "") {
        search.name = input.search;
        search.email = input.search
      }
    }

    let sort: number = -1;
    if (input.createdAt) {
      sort = input.createdAt;
    }

    return await strategy.getUsers({
      search: search,
      page: input.page,
      limit: input.limit,
      createdAt : sort,
      role: input.role,
    });
  }
}
