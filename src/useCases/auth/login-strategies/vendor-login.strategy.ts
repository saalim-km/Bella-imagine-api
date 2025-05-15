import { inject, injectable } from "tsyringe";
import { IVendorRepository } from "../../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IBcrypt } from "../../../frameworks/security/bcrypt.interface";
import { ILoginStrategy } from "../interfaces/login-strategy.interface";
import { CustomError } from "../../../entities/utils/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IVendorEntity } from "../../../entities/models/vendor.entity";
import { LoginUserDto } from "../../../shared/dtos/user.dto";
import { s3UrlCache } from "../../../frameworks/di/resolver";

@injectable()
export class VendorLoginStrategy implements ILoginStrategy {
    constructor(
        @inject("IVendorRepository") private vendorRepository : IVendorRepository,
        @inject("PasswordBcrypt") private passBcrypt : IBcrypt
    ){}

    async login(data: LoginUserDto): Promise<IVendorEntity> {
        console.log('login data : ',data);
        const vendor = await this.vendorRepository.findByEmail(data.email);

        if(!vendor) {
            throw new CustomError(
                ERROR_MESSAGES.EMAIL_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        if(vendor.isblocked) {
            throw new CustomError(ERROR_MESSAGES.BLOCKED,HTTP_STATUS.FORBIDDEN)
        }
        
        if(!data.password) {
            throw new Error('password is missing in vendor login strategy')
        }

        if(!vendor.password && vendor.googleId) {
            throw new CustomError('Please login with Google', HTTP_STATUS.UNAUTHORIZED)
        }

        const isPassMatch = await this.passBcrypt.compare(data.password, vendor.password!)

        if(!isPassMatch) {
            throw new CustomError(
                'Wrong Password',
                HTTP_STATUS.UNAUTHORIZED
            )
        }

        if(vendor.profileImage) {
            const cachedProfileImage = await s3UrlCache.getCachedSignUrl(vendor.profileImage)
            vendor.profileImage = cachedProfileImage;
        }

        return vendor;
    }
}