import { injectable } from "tsyringe";
import { ICategoryRepository } from "../../../entities/repositoryInterfaces/common/category-repository.interface";
import { CategoryModel } from "../../../frameworks/database/models/category.model";
import { ICategoryEntity } from "../../../entities/models/category.entity";
import { PaginatedCategories } from "../../../entities/models/paginated-category.entity";

@injectable()
export class CategoryRespository implements ICategoryRepository {
  async find(): Promise<ICategoryEntity[] | []> {
    return await CategoryModel.find({ status: true });
  }

  async save(title: string, categoryId: string , status : boolean): Promise<ICategoryEntity> {
    return await CategoryModel.create({ title, categoryId , status });
  }

  async findByTitle(title: string): Promise<ICategoryEntity | null> {
    return await CategoryModel.findOne({
      title: { $regex: new RegExp(`^${title.trim()}$`, "i") },
    });
  }

  async findById(id: any): Promise<ICategoryEntity | null> {
    return await CategoryModel.findById(id);
  }

  async findPaginatedCategory(
    filter: Record<string, any>,
    skip: number,
    limit: number
  ): Promise<PaginatedCategories> {
    const query: Record<string, any> = {};

    if (filter.search) {
      query.title = { $regex: filter.search, $options: "i" };
    }

    if (filter.status !== undefined) {
      query.status = filter.status
    }

    const categories = await CategoryModel.find(query)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await CategoryModel.countDocuments(query); 
    return {
      categories,
      total,
      all: total,
    };
  }

  async findByIdAndUpdateCategory(id: any , data : Partial<ICategoryEntity>): Promise<void> {
    await CategoryModel.findByIdAndUpdate(id, { $set: data });
  }
}
