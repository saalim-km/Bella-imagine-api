import { inject, injectable } from "tsyringe";
import { IVendorRepository } from "../../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { userDTO } from "../../../shared/dtos/user.dto";
import { IRegisterStrategy } from "../interfaces/register-strategy.interface";
import { IVendorEntity } from "../../../entities/models/vendor.entity";
import { CustomError } from "../../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IBcrypt } from "../../../frameworks/security/bcrypt.interface";
import { hash } from "crypto";

@injectable()
export class VendorRegisterStrategy implements IRegisterStrategy<IVendorEntity> {
    constructor(
        @inject("IVendorRepository") private vendorRepository: IVendorRepository,
        @inject("IBcrypt") private passwordBcrypt: IBcrypt
    ) {}

    async register(user: IVendorEntity): Promise<IVendorEntity> {
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

        const newVendor: IVendorEntity = {
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
            categories: [],
            languages: user.languages || [],
            description: user.description || "",
            notifications: [],
            availableSlots: [],
            services: [],
        };

        return await this.vendorRepository.save(newVendor);
    }
}
