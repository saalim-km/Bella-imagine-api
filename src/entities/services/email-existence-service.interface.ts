export interface IEmailExistenceService {
    emailExist(email : string) : Promise<boolean>;
}