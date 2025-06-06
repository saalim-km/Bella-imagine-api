import { container } from "tsyringe";
import { IWalletRepository } from "../../domain/interfaces/repository/wallet.repository";
import { WalletRepository } from "../../interfaceAdapters/repositories/wallet-repository.mongo";
import { IClientRepository } from "../../domain/interfaces/repository/client.repository";
import { ClientRepository } from "../../interfaceAdapters/repositories/client-repotitory.mongo";
import { IVendorRepository } from "../../domain/interfaces/repository/vendor.repository";
import { VendorRepository } from "../../interfaceAdapters/repositories/vendor-repository.mongo";

export class RepositoryRegistry {
    static registerRepositories() : void {

        container.register<IWalletRepository>('IWalletRepository',{
            useClass : WalletRepository
        })

        container.register<IClientRepository>('IClientRepository',{
            useClass : ClientRepository
        })

        container.register<IVendorRepository>('IVendorRepository',{
            useClass : VendorRepository
        })
    }
}