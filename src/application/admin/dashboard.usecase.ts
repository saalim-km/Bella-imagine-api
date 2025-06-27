import { inject, injectable } from "tsyringe";
import { IDashboardUsecase } from "../../domain/interfaces/usecase/admin-usecase.interface";
import { IAdminRepository } from "../../domain/interfaces/repository/admin-repository";

@injectable()
export class DashBoardUsecase implements IDashboardUsecase {
    constructor(
        @inject("IAdminRepository") private _adminRepository : IAdminRepository
    ){}

    async fetchDashBoardStats(): Promise<any> {
        return await this._adminRepository.getDashboardStats()
    }
}