import { container } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client-repository.interface";
import { ClientRepository } from "../../interfaceAdapters/repositories/client/client.repository";
import { IOTPRepository } from "../../entities/repositoryInterfaces/auth/otp-repository.interface";
import { OtpRepository } from "../../interfaceAdapters/repositories/auth/otp.repository";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { VendorRepository } from "../../interfaceAdapters/repositories/vendor/vendor.repository";

export class RepositoryRegistry {
    static registerRepositories(): void {

    // |-------------------------- Repository Registrations ----------------------------------|
    container.register<IClientRepository>("IClientRepository", { useClass: ClientRepository });

    container.register<IOTPRepository>("IOTPRepository", { useClass: OtpRepository });

    container.register<IVendorRepository>("IVendorRepository", { useClass: VendorRepository });

    }
}