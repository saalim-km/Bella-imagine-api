import { inject, injectable } from "tsyringe";
import { IEmailExistenceUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { IBaseUserRepository } from "../../domain/interfaces/repository/base-user-repository";
import { IClient } from "../../domain/models/client";
import { IVendor } from "../../domain/models/vendor";
import { ERROR_MESSAGES, TRole } from "../../shared/constants/constants";
import { CustomError } from "../../shared/utils/custom-error";

@injectable()
export class EmailExistenceUsecase implements IEmailExistenceUsecase{
    constructor(
        @inject('IBaseUserRepository') private userRepository : IBaseUserRepository<IClient | IVendor>
    ){}
    async doesEmailExist(email: string, userRole: TRole): Promise<boolean> {
        if(!email || !userRole){
            throw new CustomError(ERROR_MESSAGES.INVALID_DATAS, 400);
        }
        const user = await this.userRepository.findByEmail(email)
        if(user && user.role === userRole){
            return true;
        }
        return false
    }
}