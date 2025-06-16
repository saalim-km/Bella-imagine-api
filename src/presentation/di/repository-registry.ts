import { container } from "tsyringe";
import { IWalletRepository } from "../../domain/interfaces/repository/wallet.repository";
import { WalletRepository } from "../../interfaceAdapters/repositories/wallet-repository.mongo";
import { IClientRepository } from "../../domain/interfaces/repository/client.repository";
import { ClientRepository } from "../../interfaceAdapters/repositories/client-repotitory.mongo";
import { IVendorRepository } from "../../domain/interfaces/repository/vendor.repository";
import { VendorRepository } from "../../interfaceAdapters/repositories/vendor-repository.mongo";
import { ICategoryRepository } from "../../domain/interfaces/repository/category.repository";
import { CategoryRepository } from "../../interfaceAdapters/repositories/category-repository.mongo";
import { ICategoryRequestRepository } from "../../domain/interfaces/repository/category-request.repository";
import { CategoryRequestRepository } from "../../interfaceAdapters/repositories/category-request-repository.mongo";
import { IServiceRepository } from "../../domain/interfaces/repository/service.repository";
import { ServiceRepository } from "../../interfaceAdapters/repositories/service-repository.mongo";
import { IWorksampleRepository } from "../../domain/interfaces/repository/worksample.repository";
import { WorkSampleRepository } from "../../interfaceAdapters/repositories/worksample-repository.mongo";
import { IBookingRepository } from "../../domain/interfaces/repository/booking.repository";
import { BookingRepository } from "../../interfaceAdapters/repositories/booking-repository.mongo";
import { IPaymentRepository } from "../../domain/interfaces/repository/payment.repository";
import { PaymentRepository } from "../../interfaceAdapters/repositories/payment-repository.mongo";
import { ICommunityRepository } from "../../domain/interfaces/repository/community.repository";
import { CommunityRepository } from "../../interfaceAdapters/repositories/community-repository.mongo";
import { ICommunityMemberRepository } from "../../domain/interfaces/repository/community-member.repository";
import { CommunityMemberRepository } from "../../interfaceAdapters/repositories/community-member-repository.mongo";

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

        container.register<ICategoryRepository>('ICategoryRepository',{
            useClass : CategoryRepository
        })

        container.register<ICategoryRequestRepository>('ICategoryRequestRepository', {
            useClass : CategoryRequestRepository
        })

        container.register<IServiceRepository>('IServiceRepository',{
            useClass : ServiceRepository
        })

        container.register<IWorksampleRepository>('IWorksampleRepository' , {
            useClass : WorkSampleRepository
        })

        container.register<IBookingRepository>('IBookingRepository' , {
            useClass : BookingRepository
        })

        container.register<IPaymentRepository>('IPaymentRepository' , {
            useClass : PaymentRepository
        })

        container.register<ICommunityRepository>('ICommunityRepository' , {
            useClass : CommunityRepository
        })

        container.register<ICommunityMemberRepository>('ICommunityMemberRepository', {
            useClass : CommunityMemberRepository
        })
    }
}