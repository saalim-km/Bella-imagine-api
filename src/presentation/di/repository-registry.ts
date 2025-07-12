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
import { ICommentRepository, ICommunityMemberRepository, ICommunityPostRepository, ICommunityRepository, ILikeRepository } from "../../domain/interfaces/repository/community.repository";
import { CommunityRepository } from "../../interfaceAdapters/repositories/community-repository.mongo";
import { CommunityMemberRepository } from "../../interfaceAdapters/repositories/community-member-repository.mongo";
import { IConversationRepository } from "../../domain/interfaces/repository/conversation.repository";
import { ConversationRepository } from "../../interfaceAdapters/repositories/conversation-reposiory.mongo";
import { IMessageRepository } from "../../domain/interfaces/repository/message.repository";
import { MessageRepository } from "../../interfaceAdapters/repositories/message-repository.mongo";
import { INotificationRepository } from "../../domain/interfaces/repository/notification.repository";
import { NotificationRepository } from "../../interfaceAdapters/repositories/notification-repository.mongo";
import { CommunityPostRepository } from "../../interfaceAdapters/repositories/community-post-repository.mongo";
import { CommentRepository } from "../../interfaceAdapters/repositories/comment-reposiory.mongo";
import { LikeRepository } from "../../interfaceAdapters/repositories/like-respository.mongo";
import { IAdminRepository } from "../../domain/interfaces/repository/admin-repository";
import { AdminRepository } from "../../interfaceAdapters/repositories/admin-repository.mongo";

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

        container.register<IConversationRepository>('IConversationRepository',{
            useClass : ConversationRepository
        })

        container.register<IMessageRepository>('IMessageRepository' , {
            useClass : MessageRepository
        })

        container.register<INotificationRepository>('INotificationRepository' , {
            useClass : NotificationRepository
        })

        container.register<ICommunityPostRepository>('ICommunityPostRepository' , {
            useClass : CommunityPostRepository
        })

        container.register<ICommentRepository>('ICommentRepository' , {
            useClass : CommentRepository
        })

        container.register<ILikeRepository>('ILikeRepository', {
            useClass : LikeRepository
        })

        container.register<IAdminRepository>('IAdminRepository' , {
            useClass : AdminRepository
        })
    }
}