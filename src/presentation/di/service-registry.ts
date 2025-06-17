import { container } from "tsyringe";
import { IEmailService } from "../../domain/interfaces/service/email-service.interface";
import { EmailService } from "../../interfaceAdapters/services/email.service";
import { IBcryptService } from "../../domain/interfaces/service/bcrypt-service.interface";
import { BcryptService } from "../../interfaceAdapters/services/bcrypt.service";
import { IOtpService } from "../../domain/interfaces/service/otp-service.interface";
import { OtpService } from "../../interfaceAdapters/services/otp.service";
import { IRedisService } from "../../domain/interfaces/service/redis-service.interface";
import { RedisService } from "../../interfaceAdapters/services/redis.service";
import { IAwsS3Service } from "../../domain/interfaces/service/aws-service.interface";
import { AwsS3Service } from "../../interfaceAdapters/services/aws.service";
import { IGetPresignedUrlUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { GetPresignedUrlUsecase } from "../../application/common/get-presigned-url.usecase";
import { IJwtservice } from "../../domain/interfaces/service/jwt-service.interface";
import { JwtService } from "../../interfaceAdapters/services/jwt.service";
import { IStripeService } from "../../domain/interfaces/service/stripe-service.interface";
import { StripeService } from "../../interfaceAdapters/services/stripe.service";
import { ISocketService } from "../../domain/interfaces/service/socket-service.interface";
import { SocketService } from "../../interfaceAdapters/services/socket.service";

export class ServiceRegistry {
  static registerServices(): void {
    container.register<IEmailService>("IEmailService", {
      useClass: EmailService,
    });

    container.register<IBcryptService>("IBcryptService", {
      useClass: BcryptService,
    });
    container.register<IOtpService>("IOtpService", {
      useClass: OtpService,
    });

    container.register<IRedisService>("IRedisService", {
      useClass: RedisService,
    });

    container.register<IAwsS3Service>("IAwsS3Service",{
      useClass : AwsS3Service
    })

    container.register<IGetPresignedUrlUsecase>('IGetPresignedUrlUsecase',{
      useClass : GetPresignedUrlUsecase
    })

    container.register<IJwtservice>('IJwtservice',{
      useClass : JwtService
    })

    container.register<IStripeService>('IStripeService' , {
      useClass : StripeService
    })

    container.register<ISocketService>('ISocketService',{
      useClass : SocketService
    })
  }
}
