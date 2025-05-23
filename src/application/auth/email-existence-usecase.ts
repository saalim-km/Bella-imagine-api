import { inject, injectable } from "tsyringe";
import { IEmailExistenceUsecase } from "../../domain/interfaces/usecase/common-usecase-interfaces";
import { IBaseUserRepository } from "../../domain/interfaces/repository/base-user-repository";

@injectable()
export class EmailExistenceUsecase implements IEmailExistenceUsecase{
    constructor(
        @inject('IBaseUserRepository') private userRepository : 
    ){}

}