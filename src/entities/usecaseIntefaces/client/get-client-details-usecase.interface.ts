import { IClientEntity } from "../../models/client.entity";

export interface IGetClientDetailsUsecase {
    execute(id : any): Promise<IClientEntity | null>
}