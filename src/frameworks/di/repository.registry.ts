import { container } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client-repository.interface";
import { ClientRepository } from "../../interfaceAdapters/repositories/client/client.repository";
import { IOTPRepository } from "../../entities/repositoryInterfaces/auth/otp-repository.interface";
import { OtpRepository } from "../../interfaceAdapters/repositories/auth/otp.repository";

export class RepositoryRegistry {
    static registerRepositories(): void {

        container.register<IClientRepository>("IClientRepository",{useClass : ClientRepository});

        container.register<IOTPRepository>("IOTPRepository" ,{useClass : OtpRepository});
    }
}