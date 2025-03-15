import { inject, injectable } from "tsyringe";
import { IGoogleUseCase } from "../../entities/usecaseIntefaces/auth/google-login-usecase.interface";
import { IUserEntity } from "../../entities/models/user.entiry";
import { ERROR_MESSAGES, HTTP_STATUS, TRole } from "../../shared/constants";
import { OAuth2Client } from "google-auth-library";
import { IRegisterStrategy } from "./interfaces/register-strategy.interface";
import { ILoginStrategy } from "./interfaces/login-strategy.interface";
import { CustomError } from "../../entities/utils/custom-error";
import { IClientEntity } from "../../entities/models/client.entity";


@injectable()
export class GoogleLoginUsecase implements IGoogleUseCase {
    private registerStrategies : Record<string,IRegisterStrategy>;
    private loginStrategies : Record<string,ILoginStrategy>;
    private client : OAuth2Client;
    constructor(
        @inject("ClientRegisterStrategy") private clientRegister : IRegisterStrategy,
        @inject("VendorRegisterStrategy") private vendorRegister : IRegisterStrategy,
        @inject("ClientGoogleLoginStrategy") private clientLogin : ILoginStrategy,
        @inject("VendorGoogleLoginStrategy") private vendorLogin : ILoginStrategy
    ){
        this.registerStrategies = {
            client : this.clientRegister,
            vendor : this.vendorRegister,
        },
        this.loginStrategies = {
            client : this.clientLogin,
            vendor : this.vendorLogin
        }
        this.client = new OAuth2Client();
    }
    async execute(credential: any, client_id: any, role: TRole): Promise<Partial<IUserEntity>> {
        const registerStrategy = this.registerStrategies[role];
        const loginStrategy = this.loginStrategies[role];

        if (!registerStrategy || !loginStrategy) {
            throw new CustomError("Invalid user role", HTTP_STATUS.FORBIDDEN);
        }

        // Verify Google token
        const ticket = await this.client.verifyIdToken({
            idToken: credential,
            audience: client_id,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            throw new CustomError("Invalid or empty token payload", HTTP_STATUS.UNAUTHORIZED);
        }

        const googleId = payload.sub;
        const email = payload.email;
        let name = payload.given_name ?? "";
        const profileImage = payload.picture || "";

        if (payload.family_name) {
            name += ` ${payload.family_name}`;
        }

        if (!email) {
            throw new CustomError("Email is required", HTTP_STATUS.BAD_REQUEST);
        }


        const oppositeRole = role === "client" ? "vendor" : "client";
        const oppositeUser = await this.loginStrategies[oppositeRole].login({ email, role: oppositeRole });

        if (oppositeUser) {
            throw new CustomError(
                `This email is already registered as a ${oppositeRole}. Please log in using the correct role.`,
                HTTP_STATUS.FORBIDDEN
            );
        }


        const existingUser = await loginStrategy.login({ email, role });

        if (existingUser) {
            if (existingUser.googleId) {  
                return { email, role, _id: existingUser._id, name: existingUser.name };
            } else {
                throw new CustomError("Try logging in with password", HTTP_STATUS.CONFLICT);
            }
        }

        // Register the new user
        const newUser = await registerStrategy.register({
            name,
            email,
            role,
            googleId,
            profileImage,
        });

        if (!newUser) {
            throw new CustomError("User registration failed", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }

        return { email, role, _id: newUser._id, name: newUser.name };
    }
    
}