import { model, Document } from "mongoose";
import { CategorySchema } from "../schemas/category.schema";


export interface ICategoryEntity extends Document {
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CategoryModel = model<ICategoryEntity>("Category", CategorySchema);

export { CategoryModel };
