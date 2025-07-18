import { inject, injectable } from "tsyringe";
import { ICategoryManagementUsecase } from "../../domain/interfaces/usecase/admin-usecase.interface";
import {
  CreateNewCategoryInput,
  GetCategoriesFilterInput,
  getCatJoinRequestInput,
  UpdateCategory,
  UupdateCatReqInput,
} from "../../domain/interfaces/usecase/types/admin.types";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";
import { ICategory } from "../../domain/models/category";
import { FilterQuery, Types } from "mongoose";
import { ICategoryRepository } from "../../domain/interfaces/repository/category.repository";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";
import { generateCategoryId } from "../../shared/utils/helper/id-generator";
import { ICategoryRequest } from "../../domain/models/category-request";
import { ICategoryRequestRepository } from "../../domain/interfaces/repository/category-request.repository";
import { IVendorRepository } from "../../domain/interfaces/repository/vendor.repository";
import { Mapper } from "../../shared/utils/mapper";

@injectable()
export class CategoryManagementUsecase implements ICategoryManagementUsecase {
  constructor(
    @inject("ICategoryRepository")
    private _categoryRepository: ICategoryRepository,
    @inject("ICategoryRequestRepository")
    private _categoryRequestRepository: ICategoryRequestRepository,
    @inject("IVendorRepository") private _vendorRepository: IVendorRepository
  ) {}

  async getCategories(
    input: GetCategoriesFilterInput
  ): Promise<PaginatedResponse<Partial<ICategory>>> {
    const skip = (input.page - 1) * input.limit;
    const search: FilterQuery<ICategory> = {};

    if (typeof input.status === "boolean") {
      search.status = input.status ? true : false;
    }

    if (input.search && input.search.trim() !== "") {
      search.title = input.search;
    }
    const {data,total}=  await this._categoryRepository.getAllCategories({
      filter: search,
      limit: input.limit,
      skip: skip,
    });

    return {
      data : Mapper.categoryListMapper(data) as ICategory[],
      total : total
    }
  }

  async updateCategoryStatus(categoryId: Types.ObjectId): Promise<void> {
    const isCatExists = await this._categoryRepository.findById(categoryId);
    if (!isCatExists) {
      throw new CustomError(
        ERROR_MESSAGES.CATEGORY_NOT_FOUND,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await this._categoryRepository.update(categoryId, {
      status: !isCatExists.status,
    });
  }

  async createNewCategory(input: CreateNewCategoryInput): Promise<void> {
    const categoryId = generateCategoryId();
    await this._categoryRepository.create({ ...input, categoryId: categoryId });
  }

  async getCatJoinRequest(
    input: getCatJoinRequestInput
  ): Promise<PaginatedResponse<ICategoryRequest>> {
    const skip = (input.page - 1) * input.limit;
    const {data,total} =  await this._categoryRequestRepository.findAllRequests({
      limit: input.limit,
      skip: skip,
    });

    return {
      data : Mapper.categoryReqList(data),
      total : total
    }
  }

  async updateCategory(input: UpdateCategory): Promise<void> {
    await this._categoryRepository.update(input.id, input.data);
  }

  async updateCatJoinRequest(input: UupdateCatReqInput): Promise<void> {
    const { categoryId, status, vendorId } = input;

    const vendor = await this._vendorRepository.findById(vendorId);
    if (!vendor) {
      throw new CustomError(
        ERROR_MESSAGES.VENDOR_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    console.log('got the vendor',vendor);

    // const isCatExists = await this._categoryRepository.findById(categoryId);
    // if (!isCatExists) {
    //   throw new CustomError(
    //     ERROR_MESSAGES.CATEGORY_NOT_FOUND,
    //     HTTP_STATUS.BAD_REQUEST
    //   );
    // }

    const request = await this._categoryRequestRepository.findOne({
      categoryId: categoryId,
      vendorId : vendorId
    });
    if (!request) {
      throw new CustomError(
        ERROR_MESSAGES.REQUEST_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const isCatAlreadyExistInVendorProfile = await this._categoryRequestRepository.findOne({vendorId : vendorId , categoryId : categoryId})
    if(isCatAlreadyExistInVendorProfile?.status === 'approved'){
      throw new CustomError(ERROR_MESSAGES.CATEGORY_ALREADY_ADDED_IN_PROFILE,HTTP_STATUS.CONFLICT)
    }

    if (status === "approved") {
      if (vendor.categories && vendor.categories.length > 2) {
        throw new CustomError(
          'Vendor cannot join more than 3 categories',
          HTTP_STATUS.BAD_REQUEST
        );
      }

      await this._vendorRepository.update(vendorId, {
        $push: { categories: categoryId },
      });
    }

    await this._categoryRequestRepository.update(request._id, {
      status: status,
    });
  }

  async getCatForUsers(): Promise<PaginatedResponse<ICategory>> {
     return  await this._categoryRepository.getCatForUsers()
  }
}