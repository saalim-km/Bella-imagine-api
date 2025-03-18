import { TRole } from "../../../shared/constants";
import { IUserEntity } from "../../models/user.entity";

export interface IGoogleUseCase {
    execute(
      credential: any,
      client_id: any,
      role: TRole
    ): Promise<Partial<IUserEntity>>;
  }
  