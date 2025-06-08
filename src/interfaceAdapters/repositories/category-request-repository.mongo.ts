import { injectable } from "tsyringe";
import { ICategoryRequest } from "../../domain/models/category-request";
import { BaseRepository } from "./base-repository.mongo";
import { CategoryRequest } from "../database/schemas/category-request.schema";
import { ICategoryRequestRepository } from "../../domain/interfaces/repository/category-request.repository";
import { PaginatedResponse } from "../../domain/interfaces/usecase/types/common.types";
import { GetCatRequestInput } from "../../domain/types/admin.type";

@injectable()
export class CategoryRequestRepository
  extends BaseRepository<ICategoryRequest>
  implements ICategoryRequestRepository
{
  constructor() {
    super(CategoryRequest); 
  }

  async findAllRequests(
    input: GetCatRequestInput
  ): Promise<PaginatedResponse<ICategoryRequest>> {
    console.log('in category join req repo',input);
    const { skip, limit } = input;

      const [requests , count] = await Promise.all([
        CategoryRequest.find()
      .populate({
        path: "vendorId",
        select: "name email",
      })
      .populate({
        path: "categoryId",
        select: "title categoryId",
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(),
        this.count({})
      ])

      console.log('all requests : ',requests);
      console.log('count : ',count);
      return{
        data : requests,
        total : count
      }
  }
}
