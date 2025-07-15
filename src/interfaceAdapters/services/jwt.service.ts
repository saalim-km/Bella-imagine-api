import { injectable } from "tsyringe";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ms from "ms";
import { config } from "../../shared/config/config";
import { IJwtservice } from "../../domain/interfaces/service/jwt-service.interface";
import { TJwtPayload } from "../../domain/types/auth.types";

@injectable()
export class JwtService implements IJwtservice {
  private accessSecret: Secret;
  private accessExpireIn: string;
  private refreshSecret: Secret;
  private refreshExpireIn: string;

  constructor() {
    (this.accessSecret = config.jwt.ACCESS_SECRET_KEY);
      (this.accessExpireIn = config.jwt.ACCESS_EXPIRES_IN);
      (this.refreshExpireIn = config.jwt.REFRESH_EXPIRES_IN);
      (this.refreshSecret = config.jwt.REFRESH_SECRET_KEY);
  }

  generateAccessToken(data: TJwtPayload): string {
    const accessToken = jwt.sign(data, this.accessSecret, {
      expiresIn: this.accessExpireIn as ms.StringValue,
    });
    return accessToken
  }

  generateRefreshToken(data: TJwtPayload): string {
    const refreshToken =  jwt.sign(data, this.refreshSecret, {
      expiresIn: this.refreshExpireIn as ms.StringValue,
    });

    return refreshToken
  }

 verifyAccessToken(token: string): TJwtPayload | null {
    try {
      return jwt.verify(token, this.accessSecret) as TJwtPayload;
    } catch (error) {
      console.error('Access token verification failed:', error);
      return null;
    }
  }

  verifyRefreshToken(token: string): TJwtPayload | null {
    try {
      return jwt.verify(token, this.refreshSecret) as TJwtPayload;
    } catch (error) {
      console.error('Refresh token verification failed:', error);
      return null;
    }
  }

  // Keep decode method for non-verification scenarios
  decodeRefreshToken(token: string): JwtPayload | null {
    try {
      const decode = jwt.decode(token) as JwtPayload;
      return decode;
    } catch (error) {
      console.error('Token decode failed:', error);
      return null;
    }
  }
}
