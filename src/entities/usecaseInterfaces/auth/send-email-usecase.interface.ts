export interface ISendEmailUseCase {
    execute(email : string) : Promise<void>;
}