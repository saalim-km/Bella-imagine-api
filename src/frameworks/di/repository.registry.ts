import { container } from "tsyringe";

// Client and Vendor Repositories
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client-repository.interface";
import { ClientRepository } from "../../interfaceAdapters/repositories/client/client.repository";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { VendorRepository } from "../../interfaceAdapters/repositories/vendor/vendor.repository";

// Auth Repositories
import { IOTPRepository } from "../../entities/repositoryInterfaces/auth/otp-repository.interface";
import { OtpRepository } from "../../interfaceAdapters/repositories/auth/otp.repository";

// Admin Repositories
import { IAdminRepository } from "../../entities/repositoryInterfaces/admin/admin-repository.interface";
import { AdminRepository } from "../../interfaceAdapters/repositories/admin/admin-repository";

// Common Repositories
import { INotificationRepository } from "../../entities/repositoryInterfaces/common/notification-repository.interface";
import { NotificationRepository } from "../../interfaceAdapters/repositories/common/notification.repository";
import { ICategoryRepository } from "../../entities/repositoryInterfaces/common/category-repository.interface";
import { CategoryRespository } from "../../interfaceAdapters/repositories/common/category.repository";
import { ICategoryRequestRepository } from "../../entities/repositoryInterfaces/common/category-reqeust-repository.interface";
import { CategoryRequestRepository } from "../../interfaceAdapters/repositories/common/category-request.repository";

// Service and Work Sample Repositories
import { IServiceRepository } from "../../entities/repositoryInterfaces/service/service-repository.interface";
import { ServiceRepository } from "../../interfaceAdapters/repositories/service/service.repository";
import { IWorkSampleRepository } from "../../entities/repositoryInterfaces/work-sample/work-sample-repository.interface";
import { WorkSampleRepository } from "../../interfaceAdapters/repositories/work-sample/work-sample.repository";

// Booking and Payment Repositories
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { BookingRepository } from "../../interfaceAdapters/repositories/booking/booking.repository";
import { IPaymentRepository } from "../../entities/repositoryInterfaces/payment/payment-repository.interface";
import { PaymentRepository } from "../../interfaceAdapters/repositories/payment/payment.repository";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet-repository.interface";
import { WalletRepository } from "../../interfaceAdapters/repositories/wallet/wallet.repository";

// Chat Repositories
import { ConversationRepository } from "../../interfaceAdapters/repositories/chat/conversation.repository";
import { MessageRepository } from "../../interfaceAdapters/repositories/chat/message.repository";

// Community Repositories
import { ICommunityRepository } from "../../entities/repositoryInterfaces/community-contest/community-repository.interface";
import { ComminityRepository } from "../../interfaceAdapters/repositories/community-contest/community.repository";
import { ICommunityMemberRepository } from "../../entities/repositoryInterfaces/community-contest/community-member-repository.interface";
import { CommunityMemberRepository } from "../../interfaceAdapters/repositories/community-contest/community-member.repository";

// Contest Repositories
import IConversationRepository from "../../entities/repositoryInterfaces/chat/conversation-repository.interface";
import IMessageRepository from "../../entities/repositoryInterfaces/chat/message-repository.interface";

export class RepositoryRegistry {
  static registerRepositories(): void {
    // Client and Vendor Repositories
    container.register<IClientRepository>("IClientRepository", {
      useClass: ClientRepository,
    });
    container.register<IVendorRepository>("IVendorRepository", {
      useClass: VendorRepository,
    });

    // Auth Repositories
    container.register<IOTPRepository>("IOTPRepository", {
      useClass: OtpRepository,
    });

    // Admin Repositories
    container.register<IAdminRepository>("IAdminRepository", {
      useClass: AdminRepository,
    });

    // Common Repositories
    container.register<INotificationRepository>("INotificationRepository", {
      useClass: NotificationRepository,
    });
    container.register<ICategoryRepository>("ICategoryRepository", {
      useClass: CategoryRespository,
    });
    container.register<ICategoryRequestRepository>(
      "ICategoryRequestRepository",
      { useClass: CategoryRequestRepository }
    );

    // Service and Work Sample Repositories
    container.register<IServiceRepository>("IServiceRepository", {
      useClass: ServiceRepository,
    });
    container.register<IWorkSampleRepository>("IWorkSampleRepository", {
      useClass: WorkSampleRepository,
    });

    // Booking and Payment Repositories
    container.register<IBookingRepository>("IBookingRepository", {
      useClass: BookingRepository,
    });
    container.register<IPaymentRepository>("IPaymentRepository", {
      useClass: PaymentRepository,
    });
    container.register<IWalletRepository>("IWalletRepository", {
      useClass: WalletRepository,
    });

    // Chat Repositories
    container.register<IConversationRepository>("IConversationRepository", {
      useClass: ConversationRepository,
    });
    container.register<IMessageRepository>("IMessageRepository", {
      useClass: MessageRepository,
    });

    // Community Repositories
    container.register<ICommunityRepository>("ICommunityRepository", {
      useClass: ComminityRepository,
    });
    container.register<ICommunityMemberRepository>(
      "ICommunityMemberRepository",
      { useClass: CommunityMemberRepository }
    );
  }
}
