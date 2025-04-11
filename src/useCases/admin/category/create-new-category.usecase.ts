import { inject, injectable } from "tsyringe";
import { ICategoryRepository } from "../../entities/repositoryInterfaces/common/category-repository.interface";
import { ICreateNewCategoryUseCase } from "../../entities/usecaseInterfaces/admin/create-new-category-usecase.interface";
import { CustomError } from "../../entities/utils/custom-error";
import { HTTP_STATUS } from "../../shared/constants";
import { generateRandomUUID } from "../../frameworks/security/randomid.bcrypt";
import { generateCategoryId } from "../../shared/utils/unique-id.utils";

@injectable()
export class CreateNewCategoryUseCase implements ICreateNewCategoryUseCase {
  constructor(
    @inject("ICategoryRepository")
    private categoryRepository: ICategoryRepository
  ) {}
  async execute(title: string , status : boolean): Promise<void> {
    console.log('----------------------CreateNewCategoryUseCase---------------------------');
    console.log(title);
    const isCategoryExists = await this.categoryRepository.findByTitle(title);

    if (isCategoryExists) {
      throw new CustomError("Category Exists", HTTP_STATUS.CONFLICT);
    }

    const categoryId = generateCategoryId()
    await this.categoryRepository.save(title, categoryId , status);
  }
}
