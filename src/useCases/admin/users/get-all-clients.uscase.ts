import { inject, injectable } from "tsyringe";
import { IGetAllClientUsecase } from "../../entities/usecaseInterfaces/admin/get-all-clients-usecase.interafce";
import { IClientEntity } from "../../entities/models/client.entity";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client-repository.interface";
import { PaginatedRequestUser, PaginatedResponse } from "../../shared/types/admin/admin.type";

@injectable()
export class GetAllClientsUsecase implements IGetAllClientUsecase {
  constructor(
    @inject("IClientRepository") private clientRepository: IClientRepository
  ) {}

  async execute(
    filters: PaginatedRequestUser,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<IClientEntity>> {
    console.log('--------------------paginatedClientFetch----------------------');
    console.log(filters);
    const skip = (page - 1) * limit;


  let search: any = { role: "client" };


  if (filters) {
    if (filters.isblocked !== undefined) {
      search.isblocked = filters.isblocked;
    }
    
    if (filters.isActive !== undefined) {
      search.isActive = filters.isActive;
    }
    
    if (typeof filters.search === 'string' && filters.search.trim() !== '') {
      search = {
        ...search,
        $or: [
          { name: { $regex: filters.search.trim(), $options: "i" } },
          { email: { $regex: filters.search.trim(), $options: "i" } }
        ]
      };
    }
  }

  let sort : any = -1;
  if (filters && filters.createdAt !== undefined) {
    sort = filters.createdAt;
  }
  const result = await this.clientRepository.find(search, skip, limit,sort);
  console.log(result);
  return result;
  }
}
