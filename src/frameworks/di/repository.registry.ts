import { container } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client-repository.interface";
import { ClientRepository } from "../../interfaceAdapters/repositories/client/client.repository";
import { IOTPRepository } from "../../entities/repositoryInterfaces/auth/otp-repository.interface";
import { OtpRepository } from "../../interfaceAdapters/repositories/auth/otp.repository";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { VendorRepository } from "../../interfaceAdapters/repositories/vendor/vendor.repository";
import { IAdminRepository } from "../../entities/repositoryInterfaces/admin/admin-repository.interface";
import { AdminRepository } from "../../interfaceAdapters/repositories/admin/admin-repository";
import { INotificationRepository } from "../../entities/repositoryInterfaces/common/notification-repository.interface";
import { NotificationRepository } from "../../interfaceAdapters/repositories/common/notification.repository";
import { ICategoryRepository } from "../../entities/repositoryInterfaces/common/category-repository.interface";
import { CategoryRespository } from "../../interfaceAdapters/repositories/common/category.repository";
import { ICategoryRequestRepository } from "../../entities/repositoryInterfaces/common/category-reqeust-repository.interface";
import { CategoryRequestRepository } from "../../interfaceAdapters/repositories/common/category-request.repository";
import { IServiceRepository } from "../../entities/repositoryInterfaces/service/service-repository.interface";
import { ServiceRepository } from "../../interfaceAdapters/repositories/service/service.repository";
import { IWorkSampleRepository } from "../../entities/repositoryInterfaces/work-sample/work-sample-repository.interface";
import { WorkSampleRepository } from "../../interfaceAdapters/repositories/work-sample/work-sample.repository";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IPaymentRepository } from "../../entities/repositoryInterfaces/payment/payment-repository.interface";
import { IEscrowRepository } from "../../entities/repositoryInterfaces/escrow/escrow-repository.interface";
import { EscrowRepository } from "../../interfaceAdapters/repositories/escrow/escrow.repository";
import { BookingRepository } from "../../interfaceAdapters/repositories/booking/booking.repository";
import { PaymentRepository } from "../../interfaceAdapters/repositories/payment/payment.repository";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet-repository.interface";
import { WalletRepository } from "../../interfaceAdapters/repositories/wallet/wallet.repository";
import { IContestRepository } from "../../entities/repositoryInterfaces/contest/contest-repository.interface";
import { ContestRepository } from "../../interfaceAdapters/repositories/contest/contest.repository";
import { IParticipateContestRepository } from "../../entities/repositoryInterfaces/contest/participate-contest.repository";
import { ParticipateContestRepository } from "../../interfaceAdapters/repositories/contest/participate-contest.repository";

export class RepositoryRegistry {
  static registerRepositories(): void {
    // |-------------------------- Repository Registrations ----------------------------------|
    container.register<IClientRepository>("IClientRepository", {
      useClass: ClientRepository,
    });

    container.register<IOTPRepository>("IOTPRepository", {
      useClass: OtpRepository,
    });

    container.register<IVendorRepository>("IVendorRepository", {
      useClass: VendorRepository,
    });

    container.register<IAdminRepository>("IAdminRepository", {
      useClass: AdminRepository,
    });

    container.register<INotificationRepository>("INotificationRepository", {
      useClass: NotificationRepository,
    });

    container.register<ICategoryRepository>("ICategoryRepository", {
      useClass: CategoryRespository,
    });

    container.register<ICategoryRequestRepository>(
      "ICategoryRequestRepository",
      {
        useClass: CategoryRequestRepository,
      }
    );

    container.register<IServiceRepository>("IServiceRepository", {
      useClass: ServiceRepository,
    });

    container.register<IWorkSampleRepository>("IWorkSampleRepository", {
      useClass: WorkSampleRepository,
    });

    container.register<IBookingRepository>("IBookingRepository", {
      useClass: BookingRepository,
    });

    container.register<IPaymentRepository>("IPaymentRepository", {
      useClass: PaymentRepository,
    });

    container.register<IEscrowRepository>("IEscrowRepository", {
      useClass: EscrowRepository,
    });

    container.register<IWalletRepository>('IWalletRepository',{
      useClass : WalletRepository
    })

    container.register<IContestRepository>('IContestRepository',{
      useClass : ContestRepository
    })

    container.register<IParticipateContestRepository>("IParticipateContestRepository" , {
      useClass : ParticipateContestRepository
    })
  }
}
