import { injectable } from "tsyringe";
import { IRegisterUserUsecase } from "../../domain/interfaces/usecase/auth-usecase.interfaces";
import { RegisterUserInput } from "./auth.types";

@injectable()
export class RegisterUserUsecase implements IRegisterUserUsecase {
    constructor(){}
    async register(input: RegisterUserInput): Promise<void> {
        
    }
}