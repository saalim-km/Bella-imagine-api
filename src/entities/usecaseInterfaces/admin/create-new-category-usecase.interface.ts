export interface ICreateNewCategoryUseCase {
    execute(title: string , status : boolean): Promise<void>;
  }
  