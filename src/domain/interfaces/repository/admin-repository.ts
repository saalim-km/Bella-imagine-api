import { DashBoardStatsOuput } from "../../types/admin.type";

export interface IAdminRepository {
    getDashboardStats() : Promise<DashBoardStatsOuput>
}