import { inject, injectable } from "tsyringe";
import { IGoogleUseCase } from "../../entities/usecaseIntefaces/auth/google-login-usecase.interface";
import { IUserEntity } from "../../entities/models/user.entiry";
import { HTTP_STATUS, TRole } from "../../shared/constants";
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
        
        const registerStrategy = this.registerStrategies[role]
        const loginStrategy = this.loginStrategies[role]

        if (!registerStrategy || !loginStrategy) {
            throw new CustomError("Invalid user role", HTTP_STATUS.FORBIDDEN);
        }


        const ticket = await this.client.verifyIdToken({
            idToken : credential,
            audience : client_id
        })


        const payload = ticket.getPayload();
        if(!payload) {
            throw new CustomError(
                "Invalid or empty token payload",
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        const googleId = payload.sub;
        const email = payload.email;
        let name = `${payload.given_name}`
        const profileImage = payload.picture;


        if(payload.family_name) {
            name += ` ${payload.family_name}`
        }
        
        if (!email) {
            throw new CustomError("Email is required", HTTP_STATUS.BAD_REQUEST);
        }

        const existingUser = await loginStrategy.login({email,role});

        if(!existingUser) {
            const newUser = await registerStrategy.register({
                name : name,
                email : email,
                role : role,
                googleId : googleId,
                profileImage : profileImage,
            });

            if(!newUser) {
                throw new CustomError("", 0);
            }
            return {email,role,_id:newUser._id,name : newUser.name}
        }

        return {email,role,_id:existingUser._id,name : existingUser.name}
    }
}