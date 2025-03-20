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

    container.register<INotificationRepository>("INotificationRepository",{
        useClass : NotificationRepository
    });

    container.register<ICategoryRepository>("ICategoryRepository" , {
      useClass : CategoryRespository
    })

    container.register<ICategoryRequestRepository>("ICategoryRequestRepository",{
      useClass : CategoryRequestRepository
    })
  }
}
