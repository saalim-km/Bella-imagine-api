import { inject, injectable } from "tsyringe";
import {
  IGoogleLoginUsecase,
  ILoginUserStrategy,
  IRegisterUserStrategy,
} from "../../domain/interfaces/usecase/auth-usecase.interfaces";
import { IEmailExistenceUsecase, IGetPresignedUrlUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { GoogleLoginInput, LoginUserOuput } from "../../domain/interfaces/usecase/types/auth.types";
import { CustomError } from "../../shared/utils/custom-error";
import { OAuth2Client } from "google-auth-library";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constants";
import { config } from "../../shared/config/config";
import { IAwsS3Service } from "../../domain/interfaces/service/aws-service.interface";
import { IRedisService } from "../../domain/interfaces/service/redis-service.interface";
import logger from "../../shared/logger/logger";

@injectable()
export class GoogleLoginUsecase implements IGoogleLoginUsecase {
      private registerStrategies: Record<string, IRegisterUserStrategy>;
  private loginStrategies: Record<string, ILoginUserStrategy>;
  private client: OAuth2Client;
  constructor(
    @inject("ClientRegisterStrategy")
    private _clientRegisterStrategy: IRegisterUserStrategy,
    @inject("VendorRegisterStrategy")
    private _vendorRegisterStrategy: IRegisterUserStrategy,
    @inject("ClientLoginStrategy")
    private _clientLoginStrategy: ILoginUserStrategy,
    @inject("VendorLoginStrategy")
    private _vendortLoginStrategy: ILoginUserStrategy,
    @inject("IGetPresignedUrlUsecase")
    private _pregisnedUrl: IGetPresignedUrlUsecase,
    @inject('IEmailExistenceUsecase') private _userExistence : IEmailExistenceUsecase,
    @inject('IAwsS3Service') private _awsS3Service : IAwsS3Service,
        @inject("IRedisService") private _redisService: IRedisService
    
  ) {
    (this.registerStrategies = {
      client: this._clientRegisterStrategy,
      vendor: this._vendorRegisterStrategy,
    }),
      (this.loginStrategies = {
        client: this._clientLoginStrategy,
        vendor: this._vendortLoginStrategy,
      });
    this.client = new OAuth2Client();
  }

  async login(input: GoogleLoginInput): Promise<LoginUserOuput> {
    const {client_id,credential,role} = input;
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
      throw new CustomError(
        "Invalid or empty token payload",
        HTTP_STATUS.UNAUTHORIZED
      );
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
    console.log('opposite role for checking : ',oppositeRole);
    const {data } = await this._userExistence.doesEmailExist(email , oppositeRole)
    console.log('opposite role user : ',data);
    if (data) {
      throw new CustomError(
        `This email is already registered as a ${oppositeRole}. Please log in using the correct role.`,
        HTTP_STATUS.FORBIDDEN
      );
    }

    
    const {data : existingUser} = await this._userExistence.doesEmailExist(email,role);
    console.log('got exisging user : ',existingUser);
    if (existingUser) {
      if (existingUser.googleId) {
        if (existingUser?.profileImage) {
          logger.warn('google profile hit in googel login auth : ')
          const cachedUrl = await this._pregisnedUrl.getPresignedUrl(`${config.s3.profile}:${existingUser._id}`)
          if (cachedUrl) {
            existingUser.profileImage = cachedUrl;
          } else {
            const isFileAvailable =
              await this._awsS3Service.isFileAvailableInAwsBucket(
                existingUser.profileImage
              );
            if (isFileAvailable) {
              const presignedUrl = await this._awsS3Service.getFileUrlFromAws(
                existingUser.profileImage,
                config.redis.REDIS_PRESIGNED_URL_EXPIRY
              );
              existingUser.profileImage = presignedUrl;
              await this._redisService.set(
                `profile-url:${existingUser._id}`,
                presignedUrl,
                config.redis.REDIS_PRESIGNED_URL_EXPIRY
              );
            }
          }
        }
        logger.info('after checking exising user')
        console.log(existingUser);
        return {
          email,
          role,
          _id: existingUser._id.toString(),
          name: existingUser.name,
          avatar: existingUser.profileImage ? existingUser.profileImage : ''
        };
      } else {
        throw new CustomError(
          "Try logging in with password",
          HTTP_STATUS.CONFLICT
        );
      }
    }

    // Register the new user
    await registerStrategy.register({
        email : email,
        name : name,
        password : '',
        role : role,
        googleId : googleId,
        profileImage : profileImage ? profileImage : '',
    });

    const {data : newUser} = await this._userExistence.doesEmailExist(email,role)
    console.log('new user from google login usecase : ',newUser);
    if(!newUser || !newUser._id) {
        throw new CustomError(ERROR_MESSAGES.REGISTERATION_FAILED,HTTP_STATUS.BAD_REQUEST)
    }
    // Inside the newUser block
    if (newUser?.profileImage) {
      const cachedUrl = await this._redisService.get(`${config.s3.profile}:${newUser._id}`);
      if (cachedUrl) {
        newUser.profileImage = cachedUrl;
      } else {
        const isFileAvailable =
          await this._awsS3Service.isFileAvailableInAwsBucket(
            newUser.profileImage
          );
        if (isFileAvailable) {
          const presignedUrl = await this._awsS3Service.getFileUrlFromAws(
            newUser.profileImage,
            config.redis.REDIS_PRESIGNED_URL_EXPIRY
          );
          newUser.profileImage = presignedUrl;
          await this._redisService.set(
            `profile-url:${newUser._id}`,
            presignedUrl,
            config.redis.REDIS_PRESIGNED_URL_EXPIRY
          );
        }
      }
    }

    console.log("", newUser);
    return {
      email,
      role,
      _id: newUser._id.toString(),
      name: newUser.name,
      avatar: newUser.profileImage.toString() || '',
    };
  }
}
