import { inject, injectable } from "tsyringe";
import { IVendorRepository } from "../../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IRegisterStrategy } from "../interfaces/register-strategy.interface";
import { IVendorEntity } from "../../../entities/models/vendor.entity";
import { CustomError } from "../../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IBcrypt } from "../../../frameworks/security/bcrypt.interface";
import { generateVendorId } from "../../../shared/utils/unique-id.utils";

@injectable()
export class VendorRegisterStrategy implements IRegisterStrategy<IVendorEntity> {
    constructor(
        @inject("IVendorRepository") private vendorRepository: IVendorRepository,
        @inject("PasswordBcrypt") private passwordBcrypt: IBcrypt
    ) {}

    async register(user: IVendorEntity): Promise<IVendorEntity> {
        console.log('----------------------inVendorRegisterStrategy----------------------');
        console.log(user);
        const emailExists = await this.vendorRepository.findByEmail(user.email);

        if (emailExists) {
            throw new CustomError(
                ERROR_MESSAGES.EMAIL_EXISTS,
                HTTP_STATUS.CONFLICT
            );
        }

        let hashedPassword ;

        if (user.password) {
            hashedPassword = await this.passwordBcrypt.hash(user.password);
        }

        // -------Unique Vendor Id--------|
        let vendorId = generateVendorId()

        let data;
        if(user.googleId) {
            console.log('google id is here');
            data = await this.vendorRepository.save({
                vendorId : vendorId,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage || "",
                password: hashedPassword || "",
                googleId : user.googleId,
                phoneNumber: 0,
                location: "",
                role: "vendor", 
                isActive: true,
                isblocked: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                portfolioWebsite : "",
                categories: [],
                languages: user.languages || [],
                description: user.description || "",
                notifications: [],
                availableSlots: [],
                verificationDocuments : [],
                services: [],
            })
        }else {
            console.log('no googlId');
            data = await this.vendorRepository.save({
                vendorId : vendorId,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage || "",
                password: hashedPassword || "",
                phoneNumber: 0,
                location: "",
                role: "vendor", 
                isActive: true,
                isblocked: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                portfolioWebsite : "",
                categories: [],
                languages: user.languages || [],
                description: user.description || "",
                notifications: [],
                availableSlots: [],
                verificationDocuments : [],
                services: [],
            })
        }

        return data;
    }
}
