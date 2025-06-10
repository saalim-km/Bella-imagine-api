import { injectable } from "tsyringe";
import { ICategoryRepository } from "../../domain/interfaces/repository/category.repository";
import { BaseRepository } from "./base-repository.mongo";
import { ICategory } from "../../domain/models/category";
import { Category } from "../database/schemas/category.schema";
import { PaginatedResult } from "../../shared/types/pagination.types";
import { FilterQuery } from "mongoose";
import { GetCategoryInput } from "../../domain/types/admin.type";

@injectable()
export class CategoryRepository extends BaseRepository<ICategory> implements ICategoryRepository {
    constructor(){
        super(Category)
    }

    async getAllCategories(input: GetCategoryInput): Promise<PaginatedResult<ICategory>> {
        const {filter , skip , limit} = input;
        let query : FilterQuery<ICategory> = {}

        if(typeof filter.status === 'boolean'){
            query.status = filter.status;
        }                                           

        if(filter.title) {
            query = {
                ...query,
                title : {$regex : filter.title , $options : "i"}
            }
        }
        
        const [categories,count] = await Promise.all([
            this.findAll(query,skip,limit,-1),
            this.count(query)
        ])
        return {
            data : categories,
            total : count
        }
    }
}