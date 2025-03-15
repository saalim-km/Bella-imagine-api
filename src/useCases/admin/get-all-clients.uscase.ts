import { inject, injectable } from "tsyringe";
import { IGetAllClientUsecase } from "../../entities/usecaseIntefaces/admin/get-all-clients-usecase.interafce";
import { IClientEntity } from "../../entities/models/client.entity";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client-repository.interface";
import { PaginatedResponse } from "../../shared/types/admin/admin.type";

@injectable()
export class GetAllClientsUsecase implements IGetAllClientUsecase {
  constructor(
    @inject("IClientRepository") private clientRepository: IClientRepository
  ) {}

  async execute(
    filters: Partial<IClientEntity> = {},
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<IClientEntity>> {
    console.log('--------------------paginatedClientFetch----------------------');
    const skip = (page - 1) * limit;

    const serach = filters
      ? { name: { $regex: filters, $options: "i" }, role: "client" }
      : { role: "client" };
    const result = await this.clientRepository.find(serach, skip, limit);
    console.log(result);
    return result;
  }
}
