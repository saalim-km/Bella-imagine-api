import { container } from "tsyringe";
import { IEmailService } from "../../domain/interfaces/service/email-service.interface";
import { EmailService } from "../../interfaceAdapters/services/email-service";
import { IBcryptService } from "../../domain/interfaces/service/bcrypt-service.interface";
import { BcryptService } from "../../interfaceAdapters/services/bcrypt-service";
import { IOtpService } from "../../domain/interfaces/service/otp-service.interface";
import { OtpService } from "../../interfaceAdapters/services/otp-service";

export class ServiceRegistry {
    static registerServices(): void{
        container.register<IEmailService>('IEmailService',{
            useClass : EmailService 
        });

        container.register<IBcryptService>('IBcryptService',{
            useClass : BcryptService 
        });
        container.register<IOtpService>('IOtpService',{
            useClass : OtpService 
        });


    }
}